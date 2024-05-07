import styled from 'styled-components';

export const TxHistoryPageContainer = styled.div<{
  $isDesktopDisplay: boolean;
}>`
  display: flex;
  flex-direction: column;

  width: 100vw;
  height: ${({ $isDesktopDisplay }) => ($isDesktopDisplay ? '125vh' : '200vh')};
  overflow-x: hidden;

  padding-left: 135px;
  padding-right: 135px;
`;

export const TxHistoryContentContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 90%;

  border: 1px solid black;

  h1 {
    background: transparent;
    margin-bottom: 25px;
  }
`;

export const TxFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 10%;

  gap: 25px;

  border: 1px solid aqua;
`;

interface TxFilterButtonPropsItf {
  $isChosen: boolean;
  $width: number;
}

export const TxFilterButton = styled.button<TxFilterButtonPropsItf>`
  cursor: pointer;
  width: ${({ $width }) => `${$width}px`};
  height: 50px;

  background-color: #ffffff;
  color: ${({ $isChosen }) => ($isChosen ? '#00B5C0' : '#718096')};

  border-radius: 12px;
  border: ${({ $isChosen }) => ($isChosen ? '2px solid #00B5C0' : 'none')};
  outline: none;

  font-size: 18px;
  font-weight: 600;
  box-shadow: 1px 1px 2px gray;
`;

export const ClearTxFilterButton = styled.button`
  cursor: pointer;
  width: 150px;
  height: 50px;

  border-radius: 12px;
  background-color: transparent;
  border: none;
  outline: none;

  font-size: 18px;
  font-weight: 700;
  color: #00b5c0;
`;

export const TxMainContainer = styled.section`
  display: block;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: 1px dashed black;

  width: 100%;
  height: 75%;
  overflow: hidden;
  overflow-y: scroll;
`;

export const PaginationDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  border: 1px solid blue;

  width: 100%;
  height: 10%;
`;
