import { useEffect, useRef } from 'react';

export default function AnimatedBackground({ isDark }: { isDark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let backgroundStars: BackgroundStar[] = [];
    let constellations: Constellation[] = [];
    let animationFrameId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      init();
    };

    class BackgroundStar {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 1.2 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.speedY = (Math.random() - 0.5) * 0.1; 
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < -50) this.x = window.innerWidth + 50;
        if (this.x > window.innerWidth + 50) this.x = -50;
        if (this.y < -50) this.y = window.innerHeight + 50;
        if (this.y > window.innerHeight + 50) this.y = -50;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${this.opacity})` : `rgba(30, 58, 138, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Pre-defined realistic constellation shapes
    const CONSTELLATION_TEMPLATES = [
      {
        // Big Dipper
        stars: [{x:0, y:0}, {x:-40, y:-20}, {x:-80, y:10}, {x:-60, y:40}, {x:-100, y:60}, {x:-140, y:50}, {x:-180, y:30}],
        connections: [[0,1], [1,2], [2,3], [3,0], [3,4], [4,5], [5,6]]
      },
      {
        // Cassiopeia
        stars: [{x:0, y:0}, {x:30, y:40}, {x:60, y:10}, {x:90, y:50}, {x:120, y:-10}],
        connections: [[0,1], [1,2], [2,3], [3,4]]
      },
      {
        // Orion
        stars: [{x:0, y:-60}, {x:40, y:-50}, {x:10, y:0}, {x:20, y:5}, {x:30, y:10}, {x:-10, y:60}, {x:50, y:50}],
        connections: [[0,1], [0,2], [1,4], [2,3], [3,4], [2,5], [4,6], [5,6]]
      },
      {
        // Cygnus
        stars: [{x:0, y:0}, {x:0, y:40}, {x:0, y:120}, {x:-50, y:20}, {x:50, y:60}],
        connections: [[0,1], [1,2], [3,1], [1,4]]
      }
    ];

    class ConstellationStar {
      offsetX: number;
      offsetY: number;
      size: number;
      wobbleX: number;
      wobbleY: number;
      timeX: number;
      timeY: number;

      constructor(offsetX: number, offsetY: number) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.size = Math.random() * 1.5 + 1.0;
        this.wobbleX = Math.random() * 0.01;
        this.wobbleY = Math.random() * 0.01;
        this.timeX = Math.random() * 100;
        this.timeY = Math.random() * 100;
      }
    }

    class Constellation {
      x: number;
      y: number;
      vx: number;
      vy: number;
      stars: ConstellationStar[];
      connections: [number, number][];
      rotation: number;
      scale: number;

      constructor(startX: number, startY: number) {
        this.x = startX;
        this.y = startY;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;

        // Pick a random realistic template
        const template = CONSTELLATION_TEMPLATES[Math.floor(Math.random() * CONSTELLATION_TEMPLATES.length)];
        this.rotation = Math.random() * Math.PI * 2; // Random orientation
        this.scale = Math.random() * 0.6 + 0.6; // Scale between 0.6 and 1.2
        
        this.stars = template.stars.map(s => {
          // Apply rotation and scale
          const rotX = (s.x * Math.cos(this.rotation) - s.y * Math.sin(this.rotation)) * this.scale;
          const rotY = (s.x * Math.sin(this.rotation) + s.y * Math.cos(this.rotation)) * this.scale;
          return new ConstellationStar(rotX, rotY);
        });
        this.connections = template.connections as [number, number][];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen bounds smoothly
        if (this.x < -300) this.x = window.innerWidth + 300;
        if (this.x > window.innerWidth + 300) this.x = -300;
        if (this.y < -300) this.y = window.innerHeight + 300;
        if (this.y > window.innerHeight + 300) this.y = -300;

        // Update star wobbles
        this.stars.forEach(s => {
          s.timeX += s.wobbleX;
          s.timeY += s.wobbleY;
        });
      }

      draw() {
        if (!ctx) return;
        
        // Calculate absolute positions with gentle wobble
        const positions = this.stars.map(s => ({
          x: this.x + s.offsetX + Math.sin(s.timeX) * 15,
          y: this.y + s.offsetY + Math.cos(s.timeY) * 15,
          size: s.size
        }));

        // Draw connections (Constellation lines)
        ctx.beginPath();
        ctx.strokeStyle = isDark ? `rgba(255, 255, 255, 0.2)` : `rgba(30, 58, 138, 0.2)`;
        ctx.lineWidth = 0.8;
        this.connections.forEach(([i, j]) => {
          ctx.moveTo(positions[i].x, positions[i].y);
          ctx.lineTo(positions[j].x, positions[j].y);
        });
        ctx.stroke();

        // Draw stars
        ctx.fillStyle = isDark ? `rgba(255, 255, 255, 0.7)` : `rgba(30, 58, 138, 0.7)`;
        positions.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    const init = () => {
      backgroundStars = [];
      const numBgStars = Math.floor((window.innerWidth * window.innerHeight) / 10000);
      for (let i = 0; i < numBgStars; i++) {
        backgroundStars.push(new BackgroundStar());
      }

      constellations = [];
      // Distribute constellations evenly using a grid system to prevent clumping
      const cols = Math.max(Math.floor(window.innerWidth / 300), 3);
      const rows = Math.max(Math.floor(window.innerHeight / 300), 2);
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Calculate grid cell center and add random jitter
          const startX = (i + 0.5) * (window.innerWidth / cols) + (Math.random() - 0.5) * 150;
          const startY = (j + 0.5) * (window.innerHeight / rows) + (Math.random() - 0.5) * 150;
          constellations.push(new Constellation(startX, startY));
        }
      }
    };

    const drawAll = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      backgroundStars.forEach(star => {
        star.update();
        star.draw();
      });

      constellations.forEach(c => {
        c.update();
        c.draw();
      });

      animationFrameId = requestAnimationFrame(drawAll);
    };

    window.addEventListener('resize', resize);
    resize();
    drawAll();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
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
        width: '100%',
        height: '100%',
      }}
    />
  );
}
