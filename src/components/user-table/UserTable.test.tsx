// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { createUserId, User } from '../../types';
import { UserTable } from './UserTable';

const users: User[] = [
  {
    id: createUserId('user-martina-alvarez'),
    name: 'Martina Alvarez',
    email: 'martina.alvarez@northwindlabs.com',
    plan: 'Enterprise',
    status: 'Active',
    joinDate: '2 mins ago',
    initials: 'MA',
  },
  {
    id: createUserId('user-rafael-moreno'),
    name: 'Rafael Moreno',
    email: 'rafael.moreno@lumaops.io',
    plan: 'Professional',
    status: 'Trial',
    joinDate: '14 mins ago',
    initials: 'RM',
  },
  {
    id: createUserId('user-lucia-torres'),
    name: 'Lucia Torres',
    email: 'lucia.torres@atelierdata.co',
    plan: 'Free tier',
    status: 'Away',
    joinDate: '1 hour ago',
    initials: 'LT',
  },
  {
    id: createUserId('user-diego-silva'),
    name: 'Diego Silva',
    email: 'diego.silva@brightline.dev',
    plan: 'Professional',
    status: 'Active',
    joinDate: '1 day ago',
    initials: 'DS',
  },
  {
    id: createUserId('user-ana-garcia'),
    name: 'Ana Garcia',
    email: 'ana.garcia@orbitops.io',
    plan: 'Enterprise',
    status: 'Cancelled',
    joinDate: '2 days ago',
    initials: 'AG',
  },
  {
    id: createUserId('user-julian-vega'),
    name: 'Julian Vega',
    email: 'julian.vega@signalworks.co',
    plan: 'Free tier',
    status: 'Active',
    joinDate: '3 days ago',
    initials: 'JV',
  },
];

const renderUserTable = (externalSearchQuery?: string) =>
  render(
    <ThemeProvider>
      <UserTable users={users} externalSearchQuery={externalSearchQuery} />
    </ThemeProvider>
  );

describe('UserTable', () => {
  it('filters users by search query and explains how to recover from an empty result', async () => {
    renderUserTable();

    const searchInput = screen.getByRole('searchbox', {
      name: /filter users by name, email, plan, or status/i,
    });

    fireEvent.change(searchInput, { target: { value: 'lucia' } });

    expect(screen.getByText('Lucia Torres')).toBeInTheDocument();
    expect(screen.queryByText('Martina Alvarez')).not.toBeInTheDocument();
    expect(screen.getByText('1 of 6 users')).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'missing user' } });

    expect(screen.getByText('No users match this view')).toBeInTheDocument();
    expect(screen.getByText('Clear the search or choose a different status to widen the list.')).toBeInTheDocument();
  });

  it('filters users by status and resets pagination context', () => {
    renderUserTable();

    fireEvent.change(screen.getByRole('combobox', { name: /filter users by status/i }), {
      target: { value: 'Trial' },
    });

    expect(screen.getByText('Rafael Moreno')).toBeInTheDocument();
    expect(screen.queryByText('Martina Alvarez')).not.toBeInTheDocument();
    expect(screen.getByText('1 of 6 users')).toBeInTheDocument();
  });

  it('paginates users with accessible page controls', () => {
    renderUserTable();

    expect(screen.getByText('Showing 1 to 5 of 6')).toBeInTheDocument();
    expect(screen.queryByText('Martina Alvarez')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /show the next users page/i }));

    expect(screen.getByText('Showing 6 to 6 of 6')).toBeInTheDocument();
    expect(screen.getByText('Diego Silva')).toBeInTheDocument();
    expect(screen.queryByText('Martina Alvarez')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show users page 2/i })).toHaveAttribute('aria-current', 'page');
  });

  it('shows visible feedback for demo actions instead of dead controls', () => {
    renderUserTable();

    fireEvent.click(screen.getByRole('button', { name: /invite teammate/i }));
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'new.user@company.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /prepare invite/i }));

    expect(screen.getByText('Invite prepared for a new workspace user. No email was sent because this is a demo flow.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /open actions for martina alvarez/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /view profile/i }));

    expect(screen.getByRole('dialog', { name: /user profile/i })).toBeInTheDocument();
  });
});
