import { ModalPropsItf } from '@/components/organisms/modal/Modal';
import styled from 'styled-components';

export const ModalOverlay = styled.div<ModalPropsItf>`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(128, 128, 128, 0.5);
  backdrop-filter: blur(4px);

  z-index: 20001;
`;
export const ModalContainer = styled.div<ModalPropsItf>`
  display: flex;
  flex-direction: column;
  align-items: center;

  border-radius: 25px;
  padding: 15px 20px;

  width: ${({ $containerWidth }) => $containerWidth};
  height: ${({ $containerHeight }) => $containerHeight};
  background-color: ${({ $containerBgColor }) =>
    $containerBgColor ? $containerBgColor : '#ffffff'};

  z-index: 20002;
`;

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 50px;
  margin-bottom: 10px;

  h1 {
    width: 95%;
    color: #4a5568;
    font-size: 20px;
    background: transparent;
  }

  svg {
    cursor: pointer;
    object-fit: cover;
    width: 35px;
    height: 35px;
    background: transparent;

    path {
      transition: fill 0.3s ease;
    }

    &:hover path {
      fill: #de161c !important;
    }
  }
`;
