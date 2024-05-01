import styled from 'styled-components';

export const CustomSelectContainer = styled.div<{ $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 35px;

  text-align: center;
  border-radius: 15px;
  background-color: ${({ $disabled }) => (!$disabled ? '#ede6e7' : '#918D8D')};
  color: ${({ $disabled }) => ($disabled ? '#ffffff' : '#666b72')};
  cursor: pointer;
`;

export const CustomSelectStyle = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  top: 115%;

  width: 100%;
  max-height: 200px;
  overflow-y: auto;

  border-radius: 15px;
  background-color: #ede6e7;
  z-index: 10000;
`;

export const CustomOption = styled.div`
  cursor: pointer;
  padding: 10px;

  &:hover {
    color: white;
    background-color: #00b5c0;
  }

  &:nth-child(1) {
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
  }

  &:nth-last-child(1) {
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;
  }
  z-index: 10000;
`;
