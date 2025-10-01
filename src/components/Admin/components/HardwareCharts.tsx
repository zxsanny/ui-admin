import React from 'react';
import { parseHardware } from '../utils/parsers';
import { memoryToGBNumber } from '../utils/formatters';
import { CHART_COLORS } from '../config/constants';
import { User, ChartData, ChartSegment } from '../types';

interface HardwareChartsProps {
  users: User[] | null;
}

interface PieChartProps {
  counts: ChartData[];
  title: string;
}

const HardwareCharts: React.FC<HardwareChartsProps> = ({ users }) => {
  const arr = Array.isArray(users) ? users : (users ? [users] : []);
  if (!arr.length) {
    return <div style={{ color: '#94a3b8', fontSize: '12px' }}>No users to chart.</div>;
  }

  // Aggregate hardware data
  const cpuMap = new Map<string, number>();
  const gpuMap = new Map<string, number>();
  const memMap = new Map<string, number>();

  for (const u of arr) {
    const hw = parseHardware(u.hardware);
    const cpu = (hw && hw.cpu ? String(hw.cpu).trim() : 'Unknown');
    const gpu = (hw && hw.gpu ? String(hw.gpu).trim() : 'Unknown');
    const memGb = hw && hw.memory ? memoryToGBNumber(hw.memory) : 0;
    const memLabel = memGb ? `${Math.ceil(memGb)} GB` : 'Unknown';

    cpuMap.set(cpu, (cpuMap.get(cpu) || 0) + 1);
    gpuMap.set(gpu, (gpuMap.get(gpu) || 0) + 1);
    memMap.set(memLabel, (memMap.get(memLabel) || 0) + 1);
  }

  const getTopCounts = (map: Map<string, number>): ChartData[] => {
    const arr = Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
    
    const maxItems = 7;
    if (arr.length <= maxItems) return arr;
    
    const head = arr.slice(0, maxItems);
    const rest = arr.slice(maxItems);
    const restSum = rest.reduce((s, x) => s + x.value, 0);
    
    return [...head, { label: 'Other', value: restSum }];
  };

  const cpuCounts = getTopCounts(cpuMap);
  const gpuCounts = getTopCounts(gpuMap);
  const memCounts = getTopCounts(memMap);

  const PieChart: React.FC<PieChartProps> = ({ counts, title }) => {
    const total = counts.reduce((s, c) => s + c.value, 0) || 1;
    let acc = 0;
    
    const segments: ChartSegment[] = counts.map((c, i) => {
      const frac = c.value / total;
      const start = acc;
      acc += frac;
      const color = CHART_COLORS[i % CHART_COLORS.length];
      const startDeg = Math.round(start * 360);
      const endDeg = Math.round(acc * 360);
      return {
        color,
        startDeg,
        endDeg,
        label: c.label,
        value: c.value,
        percent: Math.round(frac * 1000) / 10
      };
    });
    
    const gradient = segments.map(s => `${s.color} ${s.startDeg}deg ${s.endDeg}deg`).join(', ');

    return (
      <div style={{
        border: '1px solid #1b2536',
        background: '#0b1223',
        borderRadius: '10px',
        padding: '12px'
      }}>
        <h4 style={{ margin: '0 0 10px', color: '#e5e7eb' }}>{title}</h4>
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          margin: '10px auto',
          background: `conic-gradient(${gradient})`
        }}></div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0', fontSize: '12px' }}>
          {segments.map((s, i) => (
            <li key={i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '6px' 
            }}>
              <span style={{
                background: s.color,
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                display: 'inline-block',
                border: '1px solid #1f2937'
              }}></span>
              <span style={{ color: '#e5e7eb' }}>{s.label}</span>
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                &nbsp;— {s.value} ({s.percent}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '12px',
      gridColumn: '1 / -1'
    }}>
      <PieChart counts={cpuCounts} title="CPU Models" />
      <PieChart counts={gpuCounts} title="GPU Models" />
      <PieChart counts={memCounts} title="Memory (GB)" />
    </div>
  );
};

export default HardwareCharts;
