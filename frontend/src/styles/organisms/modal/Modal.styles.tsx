// import { ModalPropsItf } from '@/components/organisms/modal/Modal';
import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: absolute;
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

  background: grey;
  opacity: 0.95;
  /* filter: blur(3.5px); */
  /* filter: grayscale(0.5); */

  z-index: 15;
`;

export const ModalContainer = styled.div<{ $width: string; $height: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  border-radius: 25px;
  padding: 15px 20px;
  opacity: 1;

  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};

  z-index: 20;
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
  }
`;
