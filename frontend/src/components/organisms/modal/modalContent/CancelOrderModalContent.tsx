import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import CustomButton from '@/components/atoms/button/CustomButton';
import styled from 'styled-components';

export const ConfirmCancelModalContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: start;

  width: 100%;
  height: 100%;

  div {
    width: 100%;
    height: 35px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;

    span {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 40%;
      height: 100%;
      font-size: 16px;
      font-weight: 550;
    }
  }
`;

const ConfirmCancelModalButtonsContainer = styled.section`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  align-items: center;
  justify-content: space-between;

  width: 60%;
  height: 50px;
  margin-top: 25px;
`;

const ConfirmCancelModalContent = (): React.ReactElement => {
  const emitter = useEventEmitter();
  const { setToast } = useToast();
  const { closeModal } = useModal();
  const { isDesktopDisplay } = useClientDisplayResolution();

  return (
    <ConfirmCancelModalContainer>
      <span>Pesanan yang sudah dibatalkan tidak dapat diubah</span>
      <ConfirmCancelModalButtonsContainer>
        <CustomButton
          content='Lanjutkan Pembayaran'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          onClick={() => {
            localStorage.removeItem('checkout');
            emitter.emit('close-modal-fail');
            closeModal();

            setToast({
              showToast: true,
              toastMessage: 'Silahkan lanjut untuk memilih metode pengiriman',
              toastType: 'warning',
              resolution: isDesktopDisplay ? 'desktop' : 'mobile',
              orientation: 'center',
            });
          }}
        />
        <CustomButton
          content='Lanjutkan Pembatalan'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          $bgColor='#de161c'
          onClick={() => {
            localStorage.removeItem('checkout');
            emitter.emit('close-modal-ok');
            closeModal();
          }}
        />
      </ConfirmCancelModalButtonsContainer>
    </ConfirmCancelModalContainer>
  );
};

export default ConfirmCancelModalContent;
