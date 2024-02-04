export type IResponse<T = any> = {
  success: boolean;
  message?: string;
  message_code: string;
  data?: T | null;
};

export type UUID = string;
export type EventScope = 'srm' | 'non-srm' | 'both';

export type IEvent = {
  id: UUID;
  name: string | null;
  event_code: string;
  is_group_event: boolean;
  event_scope: EventScope;
  club_name: string;
  max_group_size: number;
  created_at: Date;
  updated_at: Date | null;
};
