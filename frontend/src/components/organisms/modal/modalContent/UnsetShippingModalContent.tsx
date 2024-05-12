import { PasswordModalContentContainer } from '@/styles/organisms/modal/modalContent/PasswordModalContent.styles';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import CustomButton from '@/components/atoms/button/CustomButton';
import styled from 'styled-components';

const UnsetShippingModalButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  align-items: center;
  justify-content: space-between;

  width: 50%;
  height: 50px;
`;

const UnsetShippingModalContent = (): React.ReactElement => {
  const emitter = useEventEmitter();
  const { setToast } = useToast();
  const { closeModal } = useModal();
  const { isDesktopDisplay } = useClientDisplayResolution();

  return (
    <PasswordModalContentContainer>
      <span>Anda yakin untuk melanjutkan?</span>
      <UnsetShippingModalButtonsContainer>
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
          content='Lanjutkan'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          onClick={() => {
            emitter.emit('close-modal-ok');
            closeModal();
          }}
        />
      </UnsetShippingModalButtonsContainer>
    </PasswordModalContentContainer>
  );
};

export default UnsetShippingModalContent;
