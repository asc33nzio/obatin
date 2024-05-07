import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const Content = styled.div`
  width: 60vw;
  min-height: 80vh;
  color: ${COLORS.primary_text};
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1.5rem;
`;
export const CartSection = styled.div`
  width: 100%;
  height: max-content;
  border-radius: 12px;
  padding: 20px 30px;

  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

export const OrderSummary = styled.div`
  width: 100%;
  height: max-content;
  border-radius: 12px;

  margin-top: 5.5rem;
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
  h1 {
    font-weight: 600;
    font-size: 16px;
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
  cursor: pointer;
  p {
    color: ${COLORS.primary_text};
  }
`;

// export const AddressContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   /* border-bottom: 1px solid ${COLORS.primary_text}; */
//   padding-bottom: 20px;
//   color: ${COLORS.primary_text};
//   div {
//     display: flex;
//     flex-direction: column;
//     gap: 5px;
//     h2 {
//       font-size: 18px;
//     }
//     h3 {
//       font-size: 16px;
//       font-weight: 400;
//     }
//   }
//   a {
//     color: ${COLORS.primary_color};
//     font-weight: 700;
//     cursor: pointer;
//   }
// `;

export const PaymentSummary = styled.div`
  color: ${COLORS.primary_text};
  /* border-bottom: 1px solid ${COLORS.primary_text}; */
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

export const PaymentSummaryContainer = styled.div`
  border: 1px solid ${COLORS.primary_text};
  padding: 10px;
  border: 12px;
  min-width: 20vw;
`;

export const PharmacyName = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 20px;
  border-bottom: 0.2px solid ${COLORS.input_border};
  svg {
    width: 30px;
  }
  div {
    cursor: pointer;
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
    }
  }
`;

export const Cart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const OngkosKirim = styled.div`
  min-width: 100px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${COLORS.primary_color};
  align-items: center;
  p {
    color: ${COLORS.primary_color};
  }
`;
