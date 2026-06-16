import type { ChartConfig } from '../../../types';
import AnimatedBarChart from '../../../components/Charts/AnimatedBarChart';
import AnimatedWaterfallChart from '../../../components/Charts/AnimatedWaterfallChart';
import AnimatedScatterChart from '../../../components/Charts/AnimatedScatterChart';
import AnimatedLineChart from '../../../components/Charts/AnimatedLineChart';
import AnimatedPieChart from '../../../components/Charts/AnimatedPieChart';
import AnimatedHeatmapChart from '../../../components/Charts/AnimatedHeatmapChart';

export default function ChartRenderer({ chart, height = 210 }: { chart: ChartConfig; height?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', height: '100%' }}>
      {chart.type === 'bar' && <AnimatedBarChart data={chart.data} dataKey={chart.dataKey!} xKey={chart.xKey!} title={chart.title} caption={chart.caption} height={height} drillDown={chart.drillDown} />}
      {chart.type === 'waterfall' && <AnimatedWaterfallChart data={chart.data} dataKey={chart.dataKey!} xKey={chart.xKey!} title={chart.title} caption={chart.caption} height={height} />}
      {chart.type === 'line' && chart.lines && <AnimatedLineChart data={chart.data} lines={chart.lines} xKey={chart.xKey!} title={chart.title} caption={chart.caption} height={height} referenceValue={chart.referenceValue} />}
      {chart.type === 'pie' && <AnimatedPieChart data={chart.data} dataKey={chart.dataKey!} nameKey={chart.xKey!} title={chart.title} caption={chart.caption} height={height} />}
      {chart.type === 'heatmap' && <AnimatedHeatmapChart data={chart.data} title={chart.title} caption={chart.caption} dataKey={chart.dataKey!} xKey={chart.xKey!} height={height} />}
      {chart.type === 'scatter' && <AnimatedScatterChart data={chart.data} xKey={chart.xKey!} yKey={chart.yKey || 'value'} title={chart.title} caption={chart.caption} height={height} />}
      
      {(chart.type === 'heatmap' || chart.type === 'bar') && (
        <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right', fontStyle: 'italic', marginTop: 4 }}>
          * Click on a data point to drill down into sub-region details
        </p>
      )}
    </div>
  );
}
