import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const ViewMoreModalContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  border: 1px solid black;
`;

export const ViewMoreHeaders = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 15%;

  border: 1px solid aqua;
`;

export const ProductBreakdownContainer = styled.div`
  display: block;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 500px;
  overflow: hidden;
  overflow-y: scroll;

  padding-bottom: 20px;
  border: 1px solid red;
`;

export const TxProductBreakdownModal = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 99%;
  height: 90px;
  margin-bottom: 10px;

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
