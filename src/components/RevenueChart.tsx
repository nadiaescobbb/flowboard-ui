import { memo, useMemo, useState, useRef, useCallback } from 'react';
import { RevenueDataPoint } from '../types';
import { useThemeClasses } from '../hooks/useThemeClasses';

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

type TimeRange = 'weekly' | 'monthly';

// Generate chart path based on real data
const generatePath = (data: RevenueDataPoint[], width: number, height: number): string => {
  if (!data || data.length === 0) return '';

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const valueRange = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width;
    const normalizedValue = (point.value - minValue) / valueRange;
    const y = height - (normalizedValue * height * 0.8) - (height * 0.1);
    return { x, y };
  });

 // Create smooth path using Bézier curves

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlPointX = (current.x + next.x) / 2;

    path += ` C ${controlPointX} ${current.y}, ${controlPointX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
};

// Generar path del área (relleno)
const generateAreaPath = (linePath: string, height: number): string => {
  if (!linePath) return '';
  return `${linePath} V ${height} H 0 Z`;
};

export const RevenueChart = memo(({ data }: RevenueChartProps) => {
  const classes = useThemeClasses();
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef<SVGSVGElement>(null);

  const chartWidth = 800;
  const chartHeight = 300;

  // Generar paths memoizados
  const { linePath, areaPath, points } = useMemo(() => {
    const line = generatePath(data, chartWidth, chartHeight);
    const area = generateAreaPath(line, chartHeight);
    
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue || 1;

    const pts = data.map((point, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const normalizedValue = (point.value - minValue) / valueRange;
      const y = chartHeight - (normalizedValue * chartHeight * 0.8) - (chartHeight * 0.1);
      return { x, y, value: point.value, month: point.month };
    });

    return { linePath: line, areaPath: area, points: pts };
  }, [data, chartWidth, chartHeight]);

  // Manejar hover sobre el chart
  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const relativeX = (x / rect.width) * chartWidth;

    // Encontrar el punto más cercano
    let closestIndex = 0;
    let minDistance = Infinity;

    points.forEach((point, index) => {
      const distance = Math.abs(point.x - relativeX);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setHoveredIndex(closestIndex);
    setTooltipPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }, [points, chartWidth]);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (!data || data.length === 0) return { total: 0, average: 0, growth: 0 };

    const total = data.reduce((sum, point) => sum + point.value, 0);
    const average = total / data.length;
    const growth = data.length > 1 
      ? ((data[data.length - 1].value - data[0].value) / data[0].value) * 100 
      : 0;

    return { total, average, growth };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div 
        className={`lg:col-span-2 rounded-xl p-6 border flex items-center justify-center min-h-[400px] ${classes.surface}`}
        role="status"
      >
        <div className="text-center">
          <div className={`text-4xl mb-3 ${classes.subtitle}`}>📈</div>
          <p className={`text-sm font-medium ${classes.title}`}>No Revenue Data</p>
          <p className={`text-xs mt-1 ${classes.subtitle}`}>
            Revenue data will appear here
          </p>
        </div>
      </div>
    );
  }

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <article 
      className={`lg:col-span-2 rounded-xl p-6 border flex flex-col ${classes.surface}`}
      aria-labelledby="revenue-chart-title"
    >
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 
            id="revenue-chart-title"
            className={`font-semibold ${classes.title}`}
          >
            Revenue Over Time
          </h3>
          <p className={`text-xs mt-0.5 ${classes.subtitle}`}>
            {stats.growth >= 0 ? '↑' : '↓'} {Math.abs(stats.growth).toFixed(1)}% growth · 
            Avg: ${stats.average.toFixed(0)}k
          </p>
        </div>

        {/* Time Range Selector */}
        <div 
          className="flex gap-2"
          role="tablist"
          aria-label="Select time range"
        >
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              timeRange === 'monthly' ? classes.buttonActive : classes.button
            }`}
            role="tab"
            aria-selected={timeRange === 'monthly'}
            aria-controls="revenue-chart-panel"
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeRange('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              timeRange === 'weekly' ? classes.buttonActive : classes.button
            }`}
            role="tab"
            aria-selected={timeRange === 'weekly'}
            aria-controls="revenue-chart-panel"
          >
            Weekly
          </button>
        </div>
      </header>

      {/* Chart */}
      <div 
        className="flex-1 min-h-[300px] relative"
        id="revenue-chart-panel"
        role="tabpanel"
      >
        <svg
          ref={chartRef}
          className="w-full h-[300px] cursor-crosshair"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          aria-label="Revenue trend chart"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#137fec" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#137fec" stopOpacity="0" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={(i * chartHeight) / 4}
              x2={chartWidth}
              y2={(i * chartHeight) / 4}
              stroke={classes.isLight ? '#e5e7eb' : 'rgba(255,255,255,0.05)'}
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#chartGradient)"
            className="transition-opacity duration-300"
            opacity={hoveredIndex !== null ? 0.4 : 0.25}
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#137fec"
            strokeLinecap="round"
            strokeWidth="3"
            filter={hoveredIndex !== null ? "url(#glow)" : "none"}
            className="transition-all duration-300"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === index ? 6 : 4}
              fill="#137fec"
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-200 cursor-pointer"
              opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.3}
            />
          ))}

          {/* Hover line */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1="0"
              x2={hoveredPoint.x}
              y2={chartHeight}
              stroke="#137fec"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.5"
            />
          )}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className={`absolute pointer-events-none z-10 ${classes.surface} border rounded-lg shadow-lg px-3 py-2 transition-all duration-200`}
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${Math.max(10, tooltipPosition.y - 60)}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <p className={`text-xs font-medium ${classes.subtitle}`}>
              {hoveredPoint.month}
            </p>
            <p className={`text-lg font-bold ${classes.title} mt-1`}>
              ${hoveredPoint.value}k
            </p>
          </div>
        )}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4 px-2">
        {data.map((point, index) => (
          <span
            key={point.month}
            className={`text-[11px] font-bold transition-colors ${
              hoveredIndex === index 
                ? 'text-primary' 
                : classes.subtitle
            }`}
          >
            {point.month}
          </span>
        ))}
      </div>
    </article>
  );
});

RevenueChart.displayName = 'RevenueChart';