import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { RevenueDataPoint, RevenueDataSeries } from '../types';
import { useThemeClasses } from '../hooks/useThemeClasses';
import {
  buildAreaPath,
  buildSvgPath,
  formatCompactNumber,
  formatCurrency,
  formatPercentage,
  normalizeDataPoints,
} from '../utils';

interface RevenueChartProps {
  data: RevenueDataSeries;
}

type TimeRange = 'weekly' | 'monthly';

const chartWidth = 800;
const chartHeight = 260;

const getSeriesStats = (data: readonly RevenueDataPoint[]) => {
  if (data.length === 0) {
    return { average: 0, growth: 0, peak: null as RevenueDataPoint | null, low: null as RevenueDataPoint | null };
  }

  const total = data.reduce((sum, point) => sum + point.value, 0);
  const average = total / data.length;
  const growth = data.length > 1
    ? ((data[data.length - 1].value - data[0].value) / data[0].value) * 100
    : 0;
  const peak = data.reduce((best, item) => (item.value > best.value ? item : best), data[0]);
  const low = data.reduce((worst, item) => (item.value < worst.value ? item : worst), data[0]);

  return { average, growth, peak, low };
};

export const RevenueChart = memo(({ data }: RevenueChartProps) => {
  const classes = useThemeClasses();
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef<SVGSVGElement>(null);
  const activeData = timeRange === 'weekly' ? data.weekly : data.monthly;

  const { linePath, areaPath, points } = useMemo(() => {
    const pts = normalizeDataPoints(activeData, chartWidth, chartHeight, 0.11);
    const line = buildSvgPath(pts);
    const area = buildAreaPath(line, chartHeight, chartWidth);

    return { linePath: line, areaPath: area, points: pts };
  }, [activeData]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const relativeX = (x / rect.width) * chartWidth;
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
  }, [points]);

  const stats = useMemo(() => getSeriesStats(activeData), [activeData]);

  if (!activeData || activeData.length === 0) {
    return (
      <div className={`lg:col-span-2 rounded-md p-6 border flex items-center justify-center min-h-[400px] ${classes.surface}`} role="status">
        <div className="text-center">
          <p className={`text-sm font-display font-semibold ${classes.title}`}>Revenue data is missing</p>
          <p className={`text-xs mt-1 ${classes.subtitle}`}>Connect revenue data to review weekly movement.</p>
        </div>
      </div>
    );
  }

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;
  const growthLabel = formatPercentage(Math.abs(stats.growth)).replace('+', '');

  return (
    <article
      className={`lg:col-span-2 rounded-md p-5 md:p-6 border flex flex-col ${classes.surface}`}
      aria-labelledby="revenue-chart-title"
    >
      <header className="flex flex-col xl:flex-row xl:items-start justify-between gap-5 mb-5">
        <div>
          <p className={`text-[10px] font-display font-semibold uppercase tracking-[0.26em] ${classes.subtitle}`}>
            Operating signal
          </p>
          <h3 id="revenue-chart-title" className={`mt-1 text-xl md:text-2xl font-display font-bold ${classes.title}`}>
            Revenue over time
          </h3>
          <p className={`text-sm mt-1 ${classes.subtitle}`}>
            {stats.growth >= 0 ? 'Up' : 'Down'} {growthLabel} from first period. Average {formatCurrency(stats.average * 1000)}.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md border border-border-light dark:border-border-dark px-3 py-2">
            <p className={`text-[10px] font-display font-semibold uppercase tracking-[0.2em] ${classes.subtitle}`}>Peak</p>
            <p className={`font-display font-bold ${classes.title}`}>
              {stats.peak?.month} - {formatCompactNumber((stats.peak?.value ?? 0) * 1000)}
            </p>
          </div>
          <div className="rounded-md border border-border-light dark:border-border-dark px-3 py-2">
            <p className={`text-[10px] font-display font-semibold uppercase tracking-[0.2em] ${classes.subtitle}`}>Lowest</p>
            <p className={`font-display font-bold ${classes.title}`}>
              {stats.low?.month} - {formatCompactNumber((stats.low?.value ?? 0) * 1000)}
            </p>
          </div>
        </div>

        <div className="flex gap-2" role="tablist" aria-label="Change the revenue chart time range">
          {(['monthly', 'weekly'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => {
                setTimeRange(range);
                setHoveredIndex(null);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-display font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                timeRange === range ? classes.buttonActive : classes.button
              }`}
              role="tab"
              aria-selected={timeRange === range}
              aria-controls="revenue-chart-panel"
            >
              {range[0].toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 min-h-[260px] relative" id="revenue-chart-panel" role="tabpanel">
        <svg
          ref={chartRef}
          className="w-full h-[260px] cursor-crosshair"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
          aria-label="Revenue movement across the selected time range"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#d97757" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#d97757" stopOpacity="0" />
            </linearGradient>
          </defs>

          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={i}
              x1="0"
              y1={(i * chartHeight) / 4}
              x2={chartWidth}
              y2={(i * chartHeight) / 4}
              stroke={classes.isLight ? '#e8e6dc' : 'rgba(250,249,245,0.08)'}
              strokeWidth="1"
            />
          ))}

          <path d={areaPath} fill="url(#chartGradient)" opacity={hoveredIndex !== null ? 0.5 : 0.32} />
          <path
            d={linePath}
            fill="none"
            stroke="#d97757"
            strokeLinecap="round"
            strokeWidth="3"
            className="chart-glow"
          />

          {points.map((point, index) => (
            <circle
              key={point.label}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === index ? 6 : 3.5}
              fill={hoveredIndex === index ? '#d97757' : classes.isLight ? '#faf9f5' : '#1b1a18'}
              stroke="#d97757"
              strokeWidth="2"
              className="transition-all duration-200 cursor-pointer"
              opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
            />
          ))}

          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1="0"
              x2={hoveredPoint.x}
              y2={chartHeight}
              stroke="#d97757"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.45"
            />
          )}
        </svg>

        {hoveredPoint && (
          <div
            className={`absolute pointer-events-none z-10 ${classes.surface} border rounded-md shadow-lg px-3 py-2 transition-all duration-200`}
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${Math.max(10, tooltipPosition.y - 64)}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <p className={`text-[10px] font-display font-semibold uppercase tracking-[0.2em] ${classes.subtitle}`}>
              {hoveredPoint.label}
            </p>
            <p className={`text-lg font-display font-bold ${classes.title} mt-1`}>
              {formatCurrency(hoveredPoint.value * 1000)}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-3 px-1">
        {activeData.map((point, index) => (
          <span
            key={point.month}
            className={`text-[11px] font-display font-semibold transition-colors ${
              hoveredIndex === index ? 'text-primary' : classes.subtitle
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
