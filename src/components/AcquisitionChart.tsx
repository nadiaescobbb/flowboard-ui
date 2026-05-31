import { memo, useMemo, useState } from 'react';
import { AcquisitionChannel } from '../types';
import { useThemeClasses } from '../hooks/useThemeClasses';

interface AcquisitionChartProps {
  channels: readonly AcquisitionChannel[];
}

interface ChannelRowProps {
  channel: AcquisitionChannel;
  index: number;
  labelClass: string;
  valueClass: string;
  isLight: boolean;
}

const ChannelRow = memo(({ channel, index, labelClass, valueClass, isLight }: ChannelRowProps) => {
  return (
    <div
      className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3"
      style={{
        animationDelay: `${index * 90}ms`,
        animation: 'fadeInUp 0.5s ease-out forwards',
        opacity: 0,
      }}
      role="listitem"
    >
      <span className={`text-[11px] font-display font-semibold tabular-nums ${labelClass}`}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3 text-xs mb-2">
          <span className={`${labelClass} font-display font-semibold truncate pr-2`}>
            {channel.name}
          </span>
          <span className={`font-display font-bold ${valueClass} tabular-nums flex-shrink-0`}>
            {channel.percentage}%
          </span>
        </div>
        <div
          className={`h-1.5 w-full overflow-hidden rounded-full ${isLight ? 'bg-[#e8e6dc]' : 'bg-white/[0.08]'}`}
          role="progressbar"
          aria-valuenow={channel.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${channel.name} contributes ${channel.percentage}% of acquisition`}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${channel.percentage}%`, opacity: Math.max(channel.opacity, 0.45) }}
          />
        </div>
      </div>
    </div>
  );
});

ChannelRow.displayName = 'ChannelRow';

export const getAllocationLabel = (totalPercentage: number): string =>
  `${totalPercentage}% ${totalPercentage === 100 ? 'allocated' : 'reported'}`;

export const AcquisitionChart = memo(({ channels }: AcquisitionChartProps) => {
  const classes = useThemeClasses();
  const [showInsight, setShowInsight] = useState(false);

  const sortedChannels = useMemo(() => {
    if (!channels || channels.length === 0) return [];
    return [...channels].sort((a, b) => b.percentage - a.percentage);
  }, [channels]);

  const totalPercentage = useMemo(
    () => sortedChannels.reduce((sum, channel) => sum + channel.percentage, 0),
    [sortedChannels]
  );

  if (sortedChannels.length === 0) {
    return (
      <div
        className={`rounded-md p-4 md:p-6 border flex items-center justify-center min-h-[300px] md:min-h-[400px] ${classes.surface}`}
        role="status"
        aria-label="Acquisition source data is unavailable"
      >
        <div className="text-center">
          <p className={`text-sm font-display font-semibold ${classes.title}`}>Acquisition data is missing</p>
          <p className={`text-xs mt-1 ${classes.subtitle}`}>Connect source data to compare channel contribution.</p>
        </div>
      </div>
    );
  }

  return (
    <article
      className={`rounded-md p-5 md:p-6 border flex flex-col ${classes.surface}`}
      aria-labelledby="acquisition-chart-title"
    >
      <header className="mb-7">
        <p className={`text-[10px] font-display font-semibold uppercase tracking-[0.26em] ${classes.subtitle}`}>
          Channel mix
        </p>
        <h3 id="acquisition-chart-title" className={`mt-1 text-xl font-display font-bold ${classes.title}`}>
          Acquisition sources
        </h3>
        <p className={`text-xs mt-1 ${classes.subtitle}`}>
          Ranked by contribution - {getAllocationLabel(totalPercentage)}
        </p>
      </header>

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-6" role="list" aria-label="Ranked acquisition channel contribution">
          {sortedChannels.map((channel, index) => (
            <ChannelRow
              key={channel.name}
              channel={channel}
              index={index}
              labelClass={classes.subtitle}
              valueClass={classes.title}
              isLight={classes.isLight}
            />
          ))}
        </div>

        <button
          onClick={() => setShowInsight((current) => !current)}
          className={`mt-7 w-full py-2.5 border rounded-md text-sm font-display font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98] touch-manipulation ${classes.button}`}
          aria-label={showInsight ? 'Hide the top acquisition source summary' : 'Show the top acquisition source summary'}
          aria-expanded={showInsight}
        >
          {showInsight ? 'Hide top source summary' : 'Show top source summary'}
        </button>

        {showInsight && (
          <div className="mt-3 rounded-md border border-primary/20 bg-primary/10 p-3 text-xs text-primary" role="status">
            {sortedChannels[0].name} is the strongest source at {sortedChannels[0].percentage}%.
          </div>
        )}
      </div>
    </article>
  );
});

AcquisitionChart.displayName = 'AcquisitionChart';
