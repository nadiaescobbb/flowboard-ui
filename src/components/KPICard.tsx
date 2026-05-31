import { memo, useMemo } from 'react';
import { Icon } from './Icon';
import { KPICard as KPICardType } from '../types';
import { useThemeClasses } from '../hooks/useThemeClasses';

interface KPICardProps {
  card: KPICardType;
}

const ICON_MAP: Record<string, string> = {
  'kpi-revenue': 'payments',
  'kpi-users': 'group',
  'kpi-mrr': 'query_stats',
  'kpi-conversion': 'ads_click',
};

interface SparklineSVGProps {
  data: readonly number[];
  color: string;
}

const SparklineSVG = memo(({ data, color }: SparklineSVGProps) => {
  const pathData = useMemo(() => {
    if (!data || data.length === 0) return '';

    const points = data
      .map((val, i) => `L ${(i + 1) * (100 / data.length)} ${val}`)
      .join(' ');

    return `M0 ${data[0]} ${points}`;
  }, [data]);

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 100 40"
      role="img"
      aria-label="KPI trend preview"
      preserveAspectRatio="none"
    >
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
});

SparklineSVG.displayName = 'SparklineSVG';

export const KPICard = memo(({ card }: KPICardProps) => {
  const classes = useThemeClasses();
  const isUp = card.trend === 'up';
  const iconName = ICON_MAP[card.id] || 'bar_chart';

  const trendColor = useMemo(
    () => (isUp ? 'text-olive' : 'text-primary'),
    [isUp]
  );

  return (
    <article
      className={`group min-h-[138px] border-y md:border-y-0 md:border-l first:md:border-l-0 border-border-light dark:border-border-dark px-5 py-5 md:px-6 lg:px-7 ${classes.hover}`}
      aria-labelledby={`kpi-${card.id}-label`}
    >
      <div className="flex h-full items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="flex items-start gap-2.5">
            <Icon name={iconName} className={`!text-[18px] ${classes.subtitle}`} aria-hidden="true" />
            <h3
              id={`kpi-${card.id}-label`}
              className={`max-w-[9rem] text-[11px] font-display font-semibold uppercase leading-4 tracking-[0.16em] ${classes.subtitle}`}
            >
              {card.label}
            </h3>
          </div>

          <p
            className={`mt-5 text-2xl md:text-3xl font-display font-bold tabular-nums ${classes.title}`}
            aria-label={`${card.label} is ${card.value}`}
          >
            {card.value}
          </p>

          <div
            className={`${trendColor} text-xs font-display font-semibold mt-1 flex items-center gap-1`}
            role="status"
            aria-label={`${isUp ? 'Increased' : 'Decreased'} by ${card.change}`}
          >
            <Icon name={isUp ? 'north_east' : 'south_east'} className="!text-xs" aria-hidden="true" />
            <span>{card.change}</span>
          </div>
        </div>

        <div className="hidden sm:block w-20 h-11 md:w-24 md:h-12 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
          <SparklineSVG data={card.chartData} color={isUp ? '#788c5d' : '#d97757'} />
        </div>
      </div>
    </article>
  );
});

KPICard.displayName = 'KPICard';
