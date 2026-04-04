import { memo, useMemo } from 'react';
import { Icon } from './Icon';
import { KPICard as KPICardType } from '../types';
import { useThemeClasses } from '../hooks/useThemeClasses';

interface KPICardProps {
  card: KPICardType;
}

// Mapa de iconos por ID (más eficiente que condicionales)
const ICON_MAP: Record<string, string> = {
  '1': 'trending_up',
  '2': 'group',
  '3': 'speed',
  '4': 'shopping_cart',
};

// Componente separado para el sparkline (mejor separación de responsabilidades)
interface SparklineSVGProps {
  data: number[];
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
      aria-label="Trend chart"
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
  
  // Determinar el icono basado en el ID
  const iconName = ICON_MAP[card.id] || 'bar_chart';
  
  // Color del trend (memoizado para evitar re-cálculos)
  const trendColor = useMemo(
    () => (isUp ? 'text-emerald-500' : 'text-rose-500'),
    [isUp]
  );

  return (
    <article 
      className={`rounded-xl p-4 md:p-5 border transition-all group hover:border-primary/30 hover:shadow-lg ${classes.surface}`}
      aria-labelledby={`kpi-${card.id}-label`}
    >
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 
          id={`kpi-${card.id}-label`}
          className={`text-xs md:text-sm font-medium ${classes.subtitle}`}
        >
          {card.label}
        </h3>

        <Icon
          name={iconName}
          className="text-primary !text-lg md:!text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="flex items-end justify-between gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <p 
            className={`text-xl md:text-2xl font-bold tracking-tight ${classes.title}`}
            aria-label={`${card.label} value`}
          >
            {card.value}
          </p>

          <div 
            className={`${trendColor} text-xs font-semibold mt-1 flex items-center gap-1`}
            role="status"
            aria-label={`${isUp ? 'Increased' : 'Decreased'} by ${card.change}`}
          >
            <Icon
              name={isUp ? 'north' : 'south'}
              className="!text-xs"
              aria-hidden="true"
            />
            <span>{card.change}</span>
          </div>
        </div>

        {/* Sparkline Chart */}
        <div className="w-16 h-8 md:w-20 md:h-10 flex-shrink-0">
          <SparklineSVG data={card.chartData} color={card.chartColor} />
        </div>
      </div>
    </article>
  );
});

KPICard.displayName = 'KPICard';