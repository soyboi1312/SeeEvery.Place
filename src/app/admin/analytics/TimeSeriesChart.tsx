'use client';

import { useMemo } from 'react';

interface DataPoint {
  date: string;
  value: number;
}

interface TimeSeriesChartProps {
  data: DataPoint[];
  color?: string;
  label?: string;
  height?: number;
  showDots?: boolean;
}

export default function TimeSeriesChart({
  data,
  color = '#3b82f6',
  label = 'Value',
  height = 200,
  showDots = true,
}: TimeSeriesChartProps) {
  const { path, dots, maxValue, minValue, xLabels } = useMemo(() => {
    if (data.length === 0) {
      return { path: '', dots: [], maxValue: 0, minValue: 0, xLabels: [] };
    }

    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values, 0);
    const range = max - min || 1;

    const width = 600;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1 || 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.value - min) / range) * chartHeight;
      return { x, y, value: d.value, date: d.date };
    });

    // Create SVG path
    const pathData = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ');

    // Create area fill path
    const areaPath = pathData +
      ` L ${points[points.length - 1].x.toFixed(2)} ${(padding.top + chartHeight).toFixed(2)}` +
      ` L ${points[0].x.toFixed(2)} ${(padding.top + chartHeight).toFixed(2)} Z`;

    // X-axis labels (show first, middle, last)
    const labelIndices = [0, Math.floor(data.length / 2), data.length - 1].filter((v, i, a) => a.indexOf(v) === i);
    const labels = labelIndices.map(i => ({
      x: points[i].x,
      text: formatDate(data[i].date),
    }));

    return {
      path: pathData,
      areaPath,
      dots: points,
      maxValue: max,
      minValue: min,
      xLabels: labels,
      padding,
      chartHeight,
      width,
    };
  }, [data, height]);

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function formatValue(val: number): string {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-primary-500 dark:text-primary-400">
        No data available
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartHeight = height - padding.top - padding.bottom;
  const width = 600;

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: height }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * (1 - ratio);
          const value = minValue + (maxValue - minValue) * ratio;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                className="text-[10px] fill-gray-500 dark:fill-gray-400"
                textAnchor="end"
              >
                {formatValue(Math.round(value))}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path
          d={path + ` L ${dots[dots.length - 1]?.x.toFixed(2) || 0} ${(padding.top + chartHeight).toFixed(2)} L ${dots[0]?.x.toFixed(2) || 0} ${(padding.top + chartHeight).toFixed(2)} Z`}
          fill={color}
          fillOpacity="0.1"
        />

        {/* Line */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots && dots.map((dot, i) => (
          <g key={i}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r="4"
              fill="white"
              stroke={color}
              strokeWidth="2"
              className="cursor-pointer hover:r-6"
            >
              <title>{`${formatDate(dot.date)}: ${dot.value} ${label}`}</title>
            </circle>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map((lbl, i) => (
          <text
            key={i}
            x={lbl.x}
            y={height - 8}
            className="text-[10px] fill-gray-500 dark:fill-gray-400"
            textAnchor="middle"
          >
            {lbl.text}
          </text>
        ))}
      </svg>
    </div>
  );
}
