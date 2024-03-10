export type IResponse<T = any> = {
  success: boolean;
  message?: string;
  message_code: string;
  data?: T | null;
};

export type UUID = string;
export type EventScope = 'srm' | 'non-srm' | 'both';
export type Mode = 'online' | 'offline';

export type IUserDetailsResObj = {
  email: string;
  name: string;
  reg_number: string;
  college_name: string;
  gender: string;
};

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
  max_cap: number;
  is_active: boolean;
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

export type IUser = {
  id: UUID;
  name: string;
  email: string;
  phone_number: string;
  is_srm_ktr: boolean;
  profile_pic: string;
  college_name: string;
  reg_number: string;
  is_ticket_issued: boolean;
  created_at: Date;
  updated_at: Date | null;
  is_deleted: boolean;
};
