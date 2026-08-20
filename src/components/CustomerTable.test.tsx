import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CustomerTable } from './CustomerTable';
import { INITIAL_CUSTOMERS } from '../data/mockData';

describe('CustomerTable Component', () => {
  it('renders customer list correctly', () => {
    render(
      <CustomerTable
        customers={INITIAL_CUSTOMERS}
        searchQuery=""
        onSearchChange={() => {}}
      />
    );

    expect(screen.getByText('Meridian Analytics')).toBeInTheDocument();
    expect(screen.getByText('Vertex Systems')).toBeInTheDocument();
  });
});
