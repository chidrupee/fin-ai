import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export default function AnimatedBackground({ isDark }: { isDark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Subtle light particles — small dots
    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2.5 + 1.0,
      opacity: Math.random() * 0.3 + 0.1,
    }));

    // Soft gradient blob anchors
    const blobs = [
      { x: window.innerWidth * 0.15, y: window.innerHeight * 0.2, r: 320, color: isDark ? 'rgba(59,130,246,0.04)' : 'rgba(30,58,110,0.07)', vx: 0.15, vy: 0.1 },
      { x: window.innerWidth * 0.8,  y: window.innerHeight * 0.7, r: 280, color: isDark ? 'rgba(239,68,68,0.03)' : 'rgba(192,57,43,0.06)', vx: -0.12, vy: 0.08 },
      { x: window.innerWidth * 0.5,  y: window.innerHeight * 0.4, r: 200, color: isDark ? 'rgba(59,130,246,0.03)' : 'rgba(30,58,110,0.05)', vx: 0.08, vy: -0.1 },
    ];

    const particleRGB = isDark ? '255, 255, 255' : '30, 58, 138';

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw soft blobs
      blobs.forEach((b) => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.r || b.x > canvas.width + b.r) b.vx *= -1;
        if (b.y < -b.r || b.y > canvas.height + b.r) b.vy *= -1;
      });

      // Particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleRGB}, ${p.opacity * (isDark ? 0.9 : 1)})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      // Connect nearby particles with very faint lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${particleRGB}, ${0.25 * (1 - dist / 150) * (isDark ? 0.9 : 1)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
