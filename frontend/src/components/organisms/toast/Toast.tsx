'use client';
import {
  StyledToast,
  StyledToastContainer,
} from '@/styles/organisms/Toast.styles';
import { useToast } from '@/hooks/useToast';

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
