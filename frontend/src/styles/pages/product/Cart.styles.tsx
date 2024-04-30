import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const Content = styled.div`
  padding: 2rem 5rem;
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 2fr;
  align-items: center;
  gap: 20px;
  color: ${COLORS.primary_text};
`;
export const CartSection = styled.div`
  width: 100%;
  min-height: 80vh;
  border-radius: 12px;
  padding: 30px;
  box-shadow:
    0 10px 20px rgba(197, 197, 197, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
`;

export const OrderSummary = styled.div`
  width: 100%;
  min-height: 80vh;
  border-radius: 12px;
  padding: 30px;
  box-shadow:
    0 10px 20px rgba(197, 197, 197, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
`;

export const SectionTitle = styled.h1`
  font-weight: 500;
  font-size: 18px;
  padding: 20px 0;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
`;

export const ProductItem = styled.div`
  width: 100%;
  min-height: 50px;
  padding: 20px 0;
  border-bottom: 1px solid ${COLORS.primary_color};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Left = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  img {
    border: 0.5px solid ${COLORS.primary_color};
    border-radius: 8px;
  }
`;

export const Details = styled.div`
  div {
    display: flex;
    justify-content: space-between;
  }

  h1 {
    font-weight: 600;
    font-size: 18px;
    padding-bottom: 10px;
  }
  p {
    font-weight: 400;
    color: ${COLORS.primary_text};
    padding-bottom: 5px;
  }
`;

export const ButtonAddContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  p {
    color: ${COLORS.primary_text};
  }
`;

export const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${COLORS.primary_text};
  padding-bottom: 20px;
  color: ${COLORS.primary_text};
  div {
    display: flex;
    flex-direction: column;
    gap: 5px;
    h2 {
      font-size: 18px;
    }
    h3 {
      font-size: 18px;
      font-weight: 400;
    }
  }
  a {
    color: ${COLORS.primary_color};
    font-weight: 700;
  }
`;

export const PaymentSummary = styled.div`
  color: ${COLORS.primary_text};
  border-bottom: 1px solid ${COLORS.primary_text};
  padding-bottom: 20px;
  div {
    display: flex;
    justify-content: space-between;
    p {
      padding: 5px 0;
    }
  }
`;

export const Summary = styled.div`
  color: ${COLORS.primary_text};
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    p {
      font-weight: 600;
    }
  }
`;
