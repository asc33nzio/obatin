export type Sender = 'user' | 'doctor';

export interface IMessage {
  id: number;
  message: string;
  created_at: Date;
  sender: Sender;
}
