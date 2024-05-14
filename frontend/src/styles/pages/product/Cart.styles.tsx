import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const Content = styled.div`
  width: 60vw;
  min-height: 80vh;
  color: ${COLORS.primary_text};
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 80vw;
  }
`;

export const CartSection = styled.div`
  width: 100%;
  height: max-content;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const OrderSummary = styled.div`
  width: 100%;
  height: max-content;
  border-radius: 12px;

  margin-top: 5.5rem;
  padding: 30px;

  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

export const OrderSummaryCheckout = styled.div`
  width: 100%;
  height: 82vh;
  border-radius: 12px;

  margin-top: 5.5rem;
  padding: 30px;

  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

export const SectionTitle = styled.h1`
  font-weight: 500;
  font-size: 18px;
  padding: 20px 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${COLORS.primary_text};
  svg {
    width: 30px;
    stroke: ${COLORS.primary_text};
  }
`;

export const ProductItem = styled.div`
  width: 100%;
  min-height: 50px;
  padding: 20px;
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  align-items: flex-start;

  img {
    border: 1px solid ${COLORS.primary_color};
    border-radius: 12px;
    padding: 5px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
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
  width: 100%;
  padding: 0;

  h1 {
    font-weight: 600;
    font-size: 16px;
    padding-bottom: 10px;
  }

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    margin: 0;
    gap: 7.5px;

    span {
      width: 47.5px;
    }

    p {
      font-weight: 400;
      color: ${COLORS.primary_text};
    }
  }
`;

export const ButtonAddContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  cursor: pointer;
  p {
    color: ${COLORS.primary_text};
  }
`;

export const PaymentSummary = styled.div`
  color: ${COLORS.primary_text};
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

    h3 {
      font-size: 20px;
    }

    p {
      font-weight: 600;
    }
  }
`;

export const PaymentSummaryContainer = styled.div`
  border: 1px solid ${COLORS.primary_text};
  padding: 10px;
  border: 12px;
  min-width: 20vw;
`;

export const PharmacyName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 0.2px solid ${COLORS.input_border};

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    svg {
      cursor: pointer;
      width: 25px;
      height: 25px;
      object-fit: cover;
    }
  }
  @media (max-width: 768px) {
    div {
      div {
        gap: 10px;
      }
    }
    p {
      font-size: 13px;
    }
  }
`;

export const DeliveryItem = styled.div`
  width: 100%;
  height: max-content;

  border: 0.5px solid ${COLORS.input_border};
  border-radius: 8px;
  padding: 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border: 0.5px solid ${COLORS.primary_color};
  }

  svg {
    width: 30px;
  }

  div {
    display: flex;
    font-size: 14px;
    color: ${COLORS.primary_text};
    gap: 20px;

    div {
      flex-direction: column;
      gap: 5px;

      div {
        flex-direction: row;

        h2 {
          font-size: 14px;
        }

        p {
          font-size: 14px;
        }

        :first-child {
          width: 85px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
`;

export const Cart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const OngkosKirim = styled.div`
  cursor: pointer;
  min-width: 100px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${COLORS.primary_color};
  align-items: center;

  p {
    color: ${COLORS.primary_color};
  }
`;

export const CartItemContainer = styled.div<{
  $isNotAvailable?: boolean;
  $isOverweight?: boolean;
}>`
  width: 100%;
  height: max-content;
  border-radius: 12px;
  padding: 20px 30px;

  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border: ${({ $isNotAvailable, $isOverweight }) =>
    $isNotAvailable || $isOverweight
      ? '2px solid rgba(255, 0, 0, 0.5)'
      : 'none'};
`;

export const CheckoutPageSubcontainer = styled.div`
  width: 75vw;
  min-height: 80vh;
  color: ${COLORS.primary_text};
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 80vw;
  }
`;

export const CheckoutUploadSection = styled.section`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

export const CartAddressContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 200px;
  gap: 20px;
  border-radius: 12px;
  overflow: hidden;
  overflow-y: auto;
  padding: 20px 30px;
  transition: all 2s ease;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;
