import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const TransactionCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 99.5%;
  height: 240px;

  border: 0.5px solid ${COLORS.input_border};
  border-radius: 15px;
  box-shadow: 2px 3px 5px gray;
  margin-top: 15px;
  padding: 10px 20px 10px 10px;
  gap: 5px;
`;

export const TxHeaders = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 15%;

  h2 {
    display: flex;
    align-items: center;
    text-align: start;
    font-size: 18px;
    height: 100%;
    margin: 0;
    width: 22.5%;
    padding-left: 10px;
    color: #4a5568;
    font-weight: 400;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  h3 {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 18px;
    height: 100%;
    margin: 0;
    width: 60%;
    padding-left: 10px;
    font-weight: 750;
    color: #000000;
  }
`;

export const TxCardPharmacyName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  height: 100%;
  width: 17%;
  border-top-left-radius: 15px;
  gap: 10px;

  svg {
    cursor: pointer;
    width: 25px;
    height: 25px;
    object-fit: cover;
  }
`;

export const TxProductBreakdown = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
  height: 33.3%;

  border: 1px solid ${COLORS.input_border};
  border-radius: 15px;

  img {
    cursor: pointer;
    object-fit: cover;
    background-color: #efffff;
    height: 100%;
    width: 80px;
    border: 1px solid ${COLORS.primary_color};
    border-radius: 12px;
    padding: 5px;
  }
`;

export const BreakdownCenterDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  width: 80%;
  height: 100%;
  padding-left: 25px;

  h1 {
    height: 45%;
    width: 100%;
    margin: 0;
    display: flex;
    align-items: center;

    font-size: 22px;
    font-weight: 550;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    height: 25%;
    width: 100%;
    margin: 0;
    display: flex;
    align-items: center;

    color: #718099;
    font-size: 14px;
    font-weight: 450;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const SeparatorDiv = styled.div`
  display: flex;

  width: 0.5px;
  height: 75%;
  background-color: #a5aeb8;
`;

export const BreakdownRightDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 15%;
  height: 100%;
`;

export const SeeMoreDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  align-self: flex-end;

  cursor: pointer;
  width: 20%;
  height: 75px;
  gap: 25px;

  h4 {
    font-weight: 350;
    color: #4a5568;
  }

  svg {
    cursor: pointer;
    width: 35px;
    height: 35px;
  }
`;

export const DeliveryStatusBadge = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 225px;
  height: 100%;

  border: ${({ $color }) => `2.5px solid ${$color}`};
  border-radius: 5px;

  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;

    font-size: 14px;
    font-weight: 600;
    color: ${({ $color }) => `${$color}`};
  }
`;
