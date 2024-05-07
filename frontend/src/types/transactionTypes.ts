export type TxStatusTypes =
  | 'waitingUserPayment'
  | 'waitingConfirmation'
  | 'processed'
  | 'sent'
  | 'received'
  | 'cancelled';

export interface TxFilterItf {
  all: boolean;
  waitingUserPayment: boolean;
  waitingConfirmation: boolean;
  processed: boolean;
  sent: boolean;
  received: boolean;
  cancelled: boolean;
}
