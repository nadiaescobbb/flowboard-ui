import { Icon } from '../Icon';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
  subtitleClass: string;
  buttonClass: string;
  activeButtonClass: string;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalItems,
  totalPages,
  itemsPerPage,
  subtitleClass,
  buttonClass,
  activeButtonClass,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <footer className="p-3 md:p-4 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className={`text-xs md:text-sm ${subtitleClass}`}>
        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${buttonClass}`}
          aria-label="Show the previous users page"
        >
          <Icon name="chevron_left" aria-hidden="true" />
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            const shouldShow =
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1);

            if (shouldShow) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-display font-semibold transition-all ${
                    currentPage === page ? activeButtonClass : buttonClass
                  } hover:scale-105`}
                  aria-label={`Show users page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            }

            if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className={`px-2 ${subtitleClass}`}>
                  ...
                </span>
              );
            }

            return null;
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${buttonClass}`}
          aria-label="Show the next users page"
        >
          <Icon name="chevron_right" aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
};
