import styled from 'styled-components';

export const NotFoundContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: relative;
`;

export const NotFoundContainerContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 40vh;
  justify-content: space-around;
`;

interface NotFoundContentProps {
  fontSize: string;
  fontWeight: string;
}

export const NotFoundContent = styled.div<NotFoundContentProps>`
  font-size: ${(props) => props.fontSize || '14px'};
  font-weight: ${(props) => props.fontWeight || '400'};
`;

export const NotFoundContentButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: #00b5c0;
  color: white;
  border-radius: 25px;
  box-shadow: -1px 3px 9px 0px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  width: 40%;
  text-align: center;
  z-index: 2;
`;

export const NotFoundContentBackgroundImage = styled.div`
  position: absolute;
  bottom: -20px;
  left: -20px;
`;

export const NotFoundLine = styled.div`
  border-right: 3px solid #e2e2e2;
  height: 30vh;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NotFoundImage = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;
