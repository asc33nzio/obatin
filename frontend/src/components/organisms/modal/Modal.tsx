'use client';
import { useModal } from '@/hooks/useModal';
import { ModalContainer } from '@/styles/organisms/Modal.styles';

const Modal = (): React.ReactElement => {
  // eslint-disable-next-line
  const { isOpen, modalType, openModal, closeModal, toggleModal } = useModal();

  // eslint-disable-next-line
  const openConfirmPasswordModal = () => {
    openModal('confirm-password');
    closeModal();
  };

  return (
    <ModalContainer $width='500px' $height='500px'>
      <p>ASD</p>
    </ModalContainer>
  );
};

export default Modal;
