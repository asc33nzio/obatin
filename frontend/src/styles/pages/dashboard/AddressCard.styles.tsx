import styled from 'styled-components';

export const AddressCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 25%;
  margin-bottom: 10px;

  border-bottom: 1px solid #000000;
`;

export const AddressCardLeftSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 80%;
  height: 100%;
`;

export const AddressCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 30%;
  gap: 25px;

  h1 {
    color: #4a5568;
    font-size: 24px;
    font-weight: 650;
    background: transparent;
  }
`;

export const AddressDetails = styled.p`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 65%;

  overflow: hidden;
  overflow-y: auto;
  text-overflow: ellipsis;
  font-size: 14px;
`;

export const IsMainAddressBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 95px;
  height: 20px;

  border: 1px solid #00b5c0;
  border-radius: 5px;
  color: #00b5c0;
  font-size: 18px;
  font-weight: 550;
`;

export const AddressCardRightSection = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 20%;
  height: 100%;
  gap: 25px;

  svg {
    cursor: pointer;
    :hover {
      fill: #e7833c;
    }
  }
`;