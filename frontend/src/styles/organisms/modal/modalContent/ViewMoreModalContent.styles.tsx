import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const ViewMoreModalContainer = styled.div`
  position: relative;
  display: block;
  flex-direction: column;

  width: 100%;
  height: 100%;
  overflow-y: scroll;

  button {
    cursor: pointer;
    position: absolute;
    top: 100;
    right: 0;
    align-self: flex-end;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 185px;
    height: 30px;
    border-radius: 15px;
    outline: none;
    border: none;
    background: #c2fcff;
    padding: 15px;
    margin-right: 18px;
    font-size: 12px;
    font-weight: 800;
    border: 1px solid ${COLORS.primary_color};
    color: #006166;

    svg {
      cursor: pointer;
      object-fit: cover;
      width: 30px;
      height: 30px;
      path {
        fill: ${COLORS.primary_color};
      }
    }
  }
`;

export const ViewMoreHeaders = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 15%;
  gap: 5px;
`;

export const ProductBreakdownContainer = styled.div<{ $isExpanded: boolean }>`
  display: block;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: ${({ $isExpanded }) => ($isExpanded ? '295px' : '95px')};
  overflow: hidden;
  overflow-y: ${({ $isExpanded }) => ($isExpanded ? 'scroll' : 'hidden')};
  transition: ease-in-out 1s;
`;

export const TxProductBreakdownModal = styled.div<{ $isLastCard: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 99%;
  height: 90px;
  margin-bottom: ${({ $isLastCard }) => (!$isLastCard ? '10px' : '1px')};

  border: 1px solid ${COLORS.input_border};
  border-radius: 15px;

  img {
    cursor: pointer;
    object-fit: cover;
    background-color: #efffff;
    height: 80%;
    width: 80px;
    border: 1px solid ${COLORS.primary_color};
    border-radius: 12px;
    padding: 5px;
    margin-left: 10px;
  }
`;

export const InfoDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  height: 20%;
  width: 100%;

  h2 {
    font-weight: 450;
    font-size: 16px;
  }

  h3 {
    font-weight: 250;
    font-size: 14px;
  }

  h4 {
    font-weight: 550;
    font-size: 16px;
    color: ${COLORS.primary_color};
  }
`;

export const InfoDivAlt = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  height: 25px;
  width: 100%;
  gap: 25px;

  h2 {
    font-weight: 350;
    font-size: 16px;
    width: 150px;
  }

  h3 {
    font-weight: 250;
    font-size: 16px;
  }

  h4 {
    font-weight: 350;
    font-size: 16px;
    width: 200px;
  }

  h5 {
    font-weight: 250;
    font-size: 16px;
  }

  h6 {
    width: 200px;
    margin-top: 5px;
    font-size: 18px;
  }

  span {
    width: 10px;
    font-size: 14px;
  }

  p {
    display: flex;
    width: 75%;
    font-size: 16px;
    font-weight: 250;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const InfoDivAltLong = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  height: 100px;
  width: 100%;
  gap: 25px;

  h2 {
    font-weight: 350;
    font-size: 16px;
    width: 150px;
  }

  span {
    width: 10px;
    font-size: 14px;
  }

  p {
    display: flex;
    width: 75%;
    font-size: 16px;
    font-weight: 250;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const PharmacyInfo = styled.div`
  display: flex;
  flex-direction: column;

  height: 24%;
  width: 100%;
  margin-top: 15px;

  h1 {
    font-size: 20px;
    margin-bottom: 5px;
  }
`;

export const ShippingInfo = styled.div`
  display: flex;
  flex-direction: column;

  height: 17%;
  width: 100%;
  margin-top: 15px;

  h1 {
    font-size: 20px;
    margin-bottom: 5px;
  }

  p {
    display: flex;
    width: 75%;
    height: 50px;
    font-size: 16px;
    font-weight: 250;
    margin-top: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const PaymentInfo = styled.div`
  display: flex;
  flex-direction: column;

  height: 20%;
  width: 100%;

  h1 {
    font-size: 20px;
    margin-bottom: 5px;
  }
`;
