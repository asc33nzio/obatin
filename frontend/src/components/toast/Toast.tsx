'use client';
import { useToast } from '@/hooks/useToast';
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
