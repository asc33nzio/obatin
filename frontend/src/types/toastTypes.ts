import { Dispatch, SetStateAction } from 'react';

export type AcceptableToastType = 'ok' | 'warning' | 'error' | '';
export type AcceptableToastOrientation = 'left' | 'center' | 'right' | '';
export type AcceptableResolutionType = 'desktop' | 'mobile' | '';
export interface ToastContextItf {
  showToast: boolean;
  toastMessage: string;
  toastType: AcceptableToastType;
  resolution: AcceptableResolutionType;
  orientation: AcceptableToastOrientation;
  setToast: Dispatch<
    SetStateAction<{
      showToast: boolean;
      toastMessage: string;
      toastType: AcceptableToastType;
      resolution: AcceptableResolutionType;
      orientation: AcceptableToastOrientation;
    }>
  >;
}
