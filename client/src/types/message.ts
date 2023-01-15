import { User } from './user';

export type Message = {
  id: string;
  content: string;
  user: User;
  type: 'broadcast' | 'notify';
  color?: string;
  icon?: string;
};
