import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import CustomButton from '@/components/atoms/button/CustomButton';
import styled from 'styled-components';

export const ConfirmReceiveModalContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: start;
  width: 100%;
  height: 100%;

  span {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 30px;
    font-size: 16px;
    font-weight: 350;
  }
`;

const ConfirmReceiveModalButtonsContainer = styled.section`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  align-items: center;
  justify-content: space-between;

  width: 60%;
  height: 50px;
  margin-top: 25px;
`;

const ConfirmReceiveModalContent = (): React.ReactElement => {
  const emitter = useEventEmitter();
  const { setToast } = useToast();
  const { closeModal } = useModal();
  const { isDesktopDisplay } = useClientDisplayResolution();

  return (
    <ConfirmReceiveModalContainer>
      <span>Mohon konfirmasi penerimaan barang</span>
      <span>
        Pengajuan keluhan dapat dilakukan dalam kurun waktu 1 hari kedepan (bila
        ada)
      </span>
      <span>Terima kasih untuk pembelanjaan anda</span>
      <ConfirmReceiveModalButtonsContainer>
        <CustomButton
          content='Batal'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          $bgColor='#de161c'
          onClick={() => {
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
          content='Saya Telah Menerima'
          $width='150px'
          $height='50px'
          $fontSize='16px'
          onClick={() => {
            emitter.emit('close-modal-ok');
            closeModal();
          }}
        />
      </ConfirmReceiveModalButtonsContainer>
    </ConfirmReceiveModalContainer>
  );
};

export default ConfirmReceiveModalContent;
