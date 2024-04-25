import { Dispatch, SetStateAction } from 'react';

export interface NavbarItf {
  isOpened: boolean;
  toggleDrawer: Dispatch<SetStateAction<void>>;
}
