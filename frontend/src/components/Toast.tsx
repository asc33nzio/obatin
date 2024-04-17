'use client';
import React from 'react';
import { useToast } from '@/app/ToastProvider';
import { StyledToast, StyledToastContainer } from '@/styles/Toast.styles';

const Toast = (): React.ReactElement | null => {
  const { showToast, toastMessage, toastType, resolution, orientation } =
    useToast();

  if (!showToast) {
    return null;
  }

  return (
    <StyledToastContainer $orientation={orientation}>
      <StyledToast $type={toastType} $resolution={resolution}>
        {toastMessage}
      </StyledToast>
    </StyledToastContainer>
  );
};

export default Toast;
