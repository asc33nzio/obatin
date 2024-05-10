import { IDoctor } from './doctorItf';
import { IMessage } from './messageItf';
import { IUser } from './userItf';

export interface IChatRoom {
  chat_room_id: number;
  user_id: number;
  doctor_id: number;
  doctor_name: string;
  last_message: string;
  doctor_specialization: string;
  user_name: string;
  avatar_url_user: string;
  avatar_url_doctor: string;
  is_active: boolean;
}

export interface IResponseFromOneChatRoom {
  chat_room_id: number;
  message: IMessage[];
  doctor: IDoctor;
  user: IUser;
}

export interface IUseSWROneChatRoomResult {
  data: IResponseFromOneChatRoom[] | null;
  error: Error | null;
}
