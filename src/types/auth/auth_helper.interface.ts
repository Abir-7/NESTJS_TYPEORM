export interface LogLoginHistoryOptions {
  user_id: string;
  type: LoginNoteType;
  ip_address?: string;
  device?: string;
  location?: string;
}
export type LoginNoteType =
  | 'success'
  | 'password'
  | 'deleted'
  | 'pending_verification'
  | 'blocked'
  | 'disabled'
  | 'too_many_attempts';
