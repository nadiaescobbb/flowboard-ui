import React, { useState } from 'react';
import { Customer, StatusFilter } from '../types';
import { StatusPill } from './StatusPill';
import { PlanBadge } from './PlanBadge';
import { Btn } from './Btn';
import { formatCurrency } from '../utils/formatters';

interface CustomerTableProps {
  customers: Customer[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  searchQuery,
  onSearchChange,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sortField, setSortField] = useState<'mrr' | 'name' | 'lastActive'>('mrr');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter
  const filtered = customers.filter((c) => {
    const matchSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    let matchStatus = true;
    if (statusFilter === 'Active') {
      matchStatus = c.status === 'Paid';
    } else if (statusFilter === 'Past Due') {
      matchStatus = c.status === 'Retrying';
    } else if (statusFilter === 'Canceled') {
      matchStatus = c.status === 'Failed';
    }

    return matchSearch && matchStatus;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let comp = 0;
    if (sortField === 'mrr') {
      comp = a.mrr - b.mrr;
    } else if (sortField === 'name') {
      comp = a.name.localeCompare(b.name);
    }
    return sortOrder === 'asc' ? comp : -comp;
  });

  // Pagination
  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const paged = sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Plan', 'MRR', 'Status', 'Last Active'];
    const rows = sorted.map((c) => [c.id, c.name, c.email, c.plan, c.mrr, c.status, c.lastActive]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `flowboard_customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="table-card">
      {/* Header controls */}
      <div className="table-header-controls">
        <div className="table-title">Recent Customer Activity</div>

        {/* Filter input */}
        <div className="table-search-box">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="var(--text-tertiary)" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Filter accounts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="table-search-input"
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="table-select"
          aria-label="Filter by Status"
        >
          <option value="All">Status: All</option>
          <option value="Active">Status: Active (Paid)</option>
          <option value="Past Due">Status: Past Due (Retrying)</option>
          <option value="Canceled">Status: Canceled (Failed)</option>
        </select>

        {/* Sort Dropdown */}
        <select
          value={`${sortField}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-') as [any, any];
            setSortField(field);
            setSortOrder(order);
          }}
          className="table-select"
          aria-label="Sort Order"
        >
          <option value="mrr-desc">Sort: MRR High to Low</option>
          <option value="mrr-asc">Sort: MRR Low to High</option>
          <option value="name-asc">Sort: Name A-Z</option>
        </select>

        <div style={{ marginLeft: 'auto' }}>
          <Btn variant="default" onClick={exportCSV} style={{ fontSize: 11, height: 28 }}>
            ↓ Export CSV
          </Btn>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 240 }}>User / Org</th>
              <th>Plan</th>
              <th style={{ textAlign: 'right' }}>MRR</th>
              <th>Payment Status</th>
              <th>Last Active</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>
                  No accounts found matching search criteria.
                </td>
              </tr>
            ) : (
              paged.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-initials" style={{ background: c.color }}>
                        {c.initials}
                      </div>
                      <div>
                        <div className="user-name">{c.name}</div>
                        <div className="user-email">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <PlanBadge plan={c.plan} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="mrr-text">
                      {c.mrr > 0 ? formatCurrency(c.mrr) : '—'}
                    </span>
                  </td>
                  <td>
                    <StatusPill status={c.status} />
                  </td>
                  <td>
                    <span className="last-active-text">{c.lastActive}</span>
                  </td>
                  <td>
                    <button className="row-action-btn" title="Account actions">
                      ···
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="table-pagination-bar">
        <span className="pagination-info">
          Showing {totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}–
          {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} accounts
        </span>

        <div className="pagination-controls">
          <Btn
            variant="default"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{ fontSize: 11, padding: '3px 8px', opacity: currentPage === 1 ? 0.4 : 1 }}
          >
            ← Prev
          </Btn>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`page-num-btn ${currentPage === p ? 'active' : ''}`}
            >
              {p}
            </button>
          ))}

          <Btn
            variant="default"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{ fontSize: 11, padding: '3px 8px', opacity: currentPage === totalPages ? 0.4 : 1 }}
          >
            Next →
          </Btn>

          <div className="rows-per-page">
            <span>Rows:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rows-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
