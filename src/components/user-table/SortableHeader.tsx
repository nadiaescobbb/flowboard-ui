import { ReactNode } from 'react';
import { Icon } from '../Icon';
import { SortDirection, SortField } from './types';

interface SortableHeaderProps {
  children: ReactNode;
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export const SortableHeader = ({
  children,
  field,
  sortField,
  sortDirection,
  onSort,
}: SortableHeaderProps) => (
  <th className="px-3 md:px-6 py-3.5">
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-[0.22em] hover:text-primary transition-colors focus:outline-none focus:text-primary group"
      aria-label={`Sort users by ${field}`}
    >
      <span>{children}</span>
      <Icon
        name={
          sortField === field
            ? sortDirection === 'asc'
              ? 'arrow_upward'
              : 'arrow_downward'
            : 'unfold_more'
        }
        className="!text-xs opacity-50 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </button>
  </th>
);
