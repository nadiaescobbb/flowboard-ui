import { memo, useMemo } from 'react';
import { AcquisitionChannel } from '../types';
import { useThemeClasses } from '../hooks/useThemeClasses';

interface AcquisitionChartProps {
  channels: AcquisitionChannel[];
}

// Componente de barra de progreso individual (memoizado)
interface ProgressBarProps {
  channel: AcquisitionChannel;
  index: number;
  labelClass: string;
  valueClass: string;
  progressBg: string;
}

const ProgressBar = memo(({ channel, index, labelClass, valueClass, progressBg }: ProgressBarProps) => {
  return (
    <div 
      className="group"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.5s ease-out forwards',
        opacity: 0,
      }}
    >
      <div className="flex justify-between items-center text-xs mb-2">
        <span className={`${labelClass} font-medium truncate pr-2`}>
          {channel.name}
        </span>
        <span 
          className={`font-bold ${valueClass} tabular-nums flex-shrink-0`}
          aria-label={`${channel.percentage} percent`}
        >
          {channel.percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div 
        className={`h-2 w-full rounded-full overflow-hidden ${progressBg} relative`}
        role="progressbar"
        aria-valuenow={channel.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${channel.name} acquisition percentage`}
      >
        <div
          className="h-full bg-primary rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style={{
            width: `${channel.percentage}%`,
            opacity: channel.opacity,
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export const AcquisitionChart = memo(({ channels }: AcquisitionChartProps) => {
  const classes = useThemeClasses();

  // Validar y ordenar canales por porcentaje
  const sortedChannels = useMemo(() => {
    if (!channels || channels.length === 0) return [];
    
    return [...channels].sort((a, b) => b.percentage - a.percentage);
  }, [channels]);

  // Calcular total para verificación
  const totalPercentage = useMemo(() => {
    return sortedChannels.reduce((sum, channel) => sum + channel.percentage, 0);
  }, [sortedChannels]);

  const progressBg = classes.isLight ? 'bg-gray-200' : 'bg-white/5';

  if (sortedChannels.length === 0) {
    return (
      <div 
        className={`rounded-xl p-4 md:p-6 border flex items-center justify-center min-h-[300px] md:min-h-[400px] ${classes.surface}`}
        role="status"
        aria-label="No acquisition data available"
      >
        <div className="text-center">
          <div className={`text-3xl md:text-4xl mb-3 ${classes.subtitle}`}>📊</div>
          <p className={`text-sm font-medium ${classes.title}`}>No Data Available</p>
          <p className={`text-xs mt-1 ${classes.subtitle}`}>
            Acquisition sources will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <article 
      className={`rounded-xl p-4 md:p-6 border flex flex-col ${classes.surface}`}
      aria-labelledby="acquisition-chart-title"
    >
      
      {/* Header */}
      <header className="mb-6 md:mb-8">
        <h3 
          id="acquisition-chart-title"
          className={`text-base md:text-lg font-semibold ${classes.title}`}
        >
          Acquisition Sources
        </h3>
        <p className={`text-xs mt-0.5 ${classes.subtitle}`}>
          Top performing channels · {totalPercentage}% total
        </p>
      </header>

      {/* Channels */}
      <div className="flex-1 flex flex-col justify-between">
        <div 
          className="space-y-5 md:space-y-6"
          role="list"
          aria-label="Acquisition channels breakdown"
        >
          {sortedChannels.map((channel, index) => (
            <ProgressBar
              key={channel.name}
              channel={channel}
              index={index}
              labelClass={classes.subtitle}
              valueClass={classes.title}
              progressBg={progressBg}
            />
          ))}
        </div>

        {/* Call to Action Button */}
        <button
          onClick={() => console.log('View full analytics', sortedChannels)}
          className={`mt-6 md:mt-8 w-full py-2.5 border rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-[0.98] touch-manipulation ${classes.button} hover:scale-[1.02]`}
          aria-label="View detailed analytics for all acquisition sources"
        >
          View Full Analytics
        </button>
      </div>
    </article>
  );
});

AcquisitionChart.displayName = 'AcquisitionChart';