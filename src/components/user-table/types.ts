import { User } from '../../types';

export type SortField = 'name' | 'plan' | 'status' | 'joinDate';
export type SortDirection = 'asc' | 'desc';
export type StatusFilter = User['status'] | 'all';
export type UserAction = 'invite' | 'view' | 'edit' | 'delete';

export interface UserTableAction {
  type: UserAction;
  user?: User;
}
