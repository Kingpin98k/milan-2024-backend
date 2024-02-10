export type IResponse<T = any> = {
  success: boolean;
  message?: string;
  message_code: string;
  data?: T | null;
};

export type UUID = string;
export type EventScope = 'srm' | 'non-srm' | 'both';
export type Mode = 'online' | 'offline';

export type IEvent = {
  id: UUID;
  name: string | null;
  event_code: string;
  is_group_event: boolean;
  event_scope: EventScope;
  club_name: string;
  max_group_size: number;
  reg_count: number;
  mode: Mode;
  created_at: Date;
  updated_at: Date | null;
};

export type IEventUser = {
  id: UUID;
  user_id: UUID;
  event_id: UUID;
  event_code: string;
  user_name: string;
  created_at: Date;
  updated_at: Date | null;
};
