import { Dispatch, SetStateAction } from 'react';

export interface NavbarItf {
  isOpened: boolean;
  toggleDrawer: Dispatch<SetStateAction<void>>;
  closeDrawer: Dispatch<SetStateAction<void>>;
  isPopupOpened: boolean;
  setIsPopupOpened: Dispatch<SetStateAction<boolean>>;
}
