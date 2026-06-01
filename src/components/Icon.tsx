import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
}

const paths: Record<string, JSX.Element> = {
  add: <path d="M12 5v14M5 12h14" />,
  ads_click: <path d="M4 4l7 16 2.2-6.8L20 11 4 4ZM14 14l4 4" />,
  arrow_downward: <path d="M12 5v14M6 13l6 6 6-6" />,
  arrow_upward: <path d="M12 19V5M6 11l6-6 6 6" />,
  bar_chart: <path d="M5 19V9M12 19V5M19 19v-7" />,
  check_circle: <path d="M20 6 9 17l-5-5" />,
  chevron_left: <path d="m15 18-6-6 6-6" />,
  chevron_right: <path d="m9 18 6-6-6-6" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  dashboard: <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" />,
  dark_mode: <path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z" />,
  delete: <path d="M6 7h12M10 11v6M14 11v6M9 7l1-3h4l1 3M8 7l1 13h6l1-13" />,
  edit: <path d="m4 16-.5 4 4-.5L18 9l-3.5-3.5L4 16ZM13.5 6.5 17 10" />,
  error: <path d="M12 9v4M12 17h.01M10.3 4.3h3.4L21 17.4 19.3 20H4.7L3 17.4 10.3 4.3Z" />,
  group: <path d="M16 19v-1.5c0-2-1.8-3.5-4-3.5s-4 1.5-4 3.5V19M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 19v-1c0-1.7-1.2-3-3-3.4M17 5.4a2.5 2.5 0 0 1 0 4.8M4 19v-1c0-1.7 1.2-3 3-3.4M7 5.4a2.5 2.5 0 0 0 0 4.8" />,
  help: <path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.9.8-1.8 1.2-1.8 2.8M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  insights: <path d="M4 17h16M6 14l4-4 3 3 5-7M6 6h.01M6 10h.01" />,
  light_mode: <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  more_horiz: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
  north_east: <path d="M7 17 17 7M9 7h8v8" />,
  notifications: <path d="M18 16H6l1.5-2.5V10a4.5 4.5 0 0 1 9 0v3.5L18 16ZM10 19h4" />,
  payments: <path d="M3 7h18v10H3V7Zm3 3h4M15 14h3M7 17v2M17 17v2" />,
  person: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20c1-3.5 4-5 8-5s7 1.5 8 5" />,
  query_stats: <path d="M4 19V5M4 19h16M7 15l3-4 3 2 5-7M18 6h-4M18 6v4" />,
  search: <path d="m21 21-4.5-4.5M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />,
  search_off: <path d="m21 21-4.5-4.5M8.5 4.4a7.5 7.5 0 0 1 8.1 12.1M13 18a7.5 7.5 0 0 1-8.5-8.5M3 3l18 18" />,
  settings: <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19 13.5v-3l-2-.4a6 6 0 0 0-.7-1.7l1.1-1.8-2.1-2.1-1.8 1.1a6 6 0 0 0-1.7-.7L11.5 3h-3l-.4 1.9a6 6 0 0 0-1.7.7L4.6 4.5 2.5 6.6l1.1 1.8a6 6 0 0 0-.7 1.7L1 10.5v3l1.9.4a6 6 0 0 0 .7 1.7l-1.1 1.8 2.1 2.1 1.8-1.1a6 6 0 0 0 1.7.7l.4 1.9h3l.4-1.9a6 6 0 0 0 1.7-.7l1.8 1.1 2.1-2.1-1.1-1.8a6 6 0 0 0 .7-1.7l1.9-.4Z" />,
  south_east: <path d="m7 7 10 10M17 9v8H9" />,
  unfold_more: <path d="m8 9 4-4 4 4M8 15l4 4 4-4" />,
};

export const Icon = ({ name, className = '', ...props }: IconProps) => {
  const icon = paths[name] ?? paths.help;

  return (
    <svg
      className={`inline-block size-[1em] flex-shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={props['aria-hidden'] ?? true}
      {...props}
    >
      {icon}
    </svg>
  );
};
