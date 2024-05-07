import styled from 'styled-components';

export const TransactionCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 240px;

  border: 1px solid red;
  border-radius: 15px;
  margin-top: 15px;
  padding: 10px;
  gap: 5px;
`;

export const TxHeaders = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 15%;

  h1 {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid black;
    border-top-left-radius: 15px;
    font-size: 18px;
    height: 100%;
    margin: 0;
    font-weight: 500;
    width: 35%;
  }

  h2 {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    font-size: 18px;
    height: 100%;
    margin: 0;
    width: 20%;
    color: #4a5568;
    font-weight: 400;
  }

  h3 {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border: 1px solid black;
    border-top-right-radius: 15px;
    font-size: 18px;
    height: 100%;
    margin: 0;
    width: 35%;
    font-weight: 750;
    color: #000000;
  }
`;

export const TxProductBreakdown = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
  height: 35%;

  background-color: blue;

  img {
    background-color: #efffff;
    height: 100%;
  }
`;
