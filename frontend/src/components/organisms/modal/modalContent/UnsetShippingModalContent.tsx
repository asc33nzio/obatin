import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import CustomButton from '@/components/atoms/button/CustomButton';
import styled from 'styled-components';

export const UnsetShippingModalContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: start;

  width: 100%;
  height: 100%;
  gap: 3px;

  span {
    font-size: 16px;
  }
`;

const UnsetShippingModalButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  align-items: center;
  justify-content: space-between;

  width: 50%;
  height: 50px;

  margin-top: 25px;
`;

const UnsetShippingModalContent = (): React.ReactElement => {
  const emitter = useEventEmitter();
  const { setToast } = useToast();
  const { closeModal } = useModal();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const unsetShipping = localStorage.getItem('unsetShipping');

  return (
    <UnsetShippingModalContentContainer>
      <span>Anda yakin untuk melanjutkan?</span>
      <span>
        Ada {unsetShipping} produk dalam keranjang yang belum ditetapkan metode
        pengirimannya
      </span>
      <span>
        Bila kamu melanjutkan, produk-produk dari apotik tersebut tidak diproses
      </span>
      <UnsetShippingModalButtonsContainer>
        <CustomButton
          content='Batal'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          $bgColor='#de161c'
          onClick={() => {
            localStorage.removeItem('unsetShipping');
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
          content='Lanjutkan'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          onClick={() => {
            localStorage.removeItem('unsetShipping');
            emitter.emit('close-modal-ok');
            closeModal();
          }}
        />
      </UnsetShippingModalButtonsContainer>
    </UnsetShippingModalContentContainer>
  );
};

export default UnsetShippingModalContent;
