import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  hasCloseBtn?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const CustomDialog = styled.dialog`
  position: relative;
  align-self: center;
  justify-self: center;
  border: none;
  border-radius: 12px;

  &::backdrop {
    background: #00000057;
  }
`;

const CustomCloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 0.3rem;
  cursor: pointer;
`;

export const DialogModal: React.FC<ModalProps> = ({
  isOpen,
  hasCloseBtn = true,
  onClose,
  children,
}) => {
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
    setModalOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      handleCloseModal();
    }
  };

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  return (
    <CustomDialog ref={modalRef} onKeyDown={handleKeyDown}>
      {hasCloseBtn && (
        <CustomCloseBtn onClick={handleCloseModal}>x</CustomCloseBtn>
      )}
      {children}
    </CustomDialog>
  );
};
