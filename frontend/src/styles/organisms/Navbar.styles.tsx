import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const NavContainer = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 19999;
  background-color: white;

  align-self: center;
  justify-self: center;

  height: 125px;
  width: 100vw;
  margin-bottom: 25px;

  padding-left: 50px;
  padding-right: 75px;
  border-bottom: 0.5px solid ${COLORS.input_border};

  @media (max-width: 1440px) {
    width: 100%;
    gap: 20px;
  }
  @media (max-width: 769px) {
    width: 100%;
    padding: 0 0 20px 0;
    flex-direction: column;
    height: max-content;
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 250px;
  height: 75px;
  gap: 25px;

  svg {
    cursor: pointer;
    object-fit: cover;

    width: 50%;
    height: 100%;
  }
  @media (max-width: 769px) {
    padding: 0;
  }
  @media (max-width: 769px) {
    padding: 0;
  }
`;

export const IconContainer = styled.div`
  background: transparent;

  svg {
    cursor: pointer;
    height: 50px;
  }
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  svg {
    width: 40px;
    height: 40px;
    color: ${COLORS.primary_color};
    stroke: 1px solid ${COLORS.primary_color};
  }
`;

export const CartContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

export const Quantity = styled.div`
  background-color: #ff6500;
  border-radius: 50%;
  padding: 4px;
  font-size: 12px;
  width: 25px;
  height: 25px;
  text-align: center;
  color: white;
  font-weight: 600;
`;

export const ImgBg = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 80px;
  height: 80px;

  border-radius: 50%;
  border: 5px solid #00b5c0;
  box-shadow: 0 0 10px 5px #bdbdbd;

  img {
    object-fit: cover;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: transparent;
  }
`;

export const VerifyPopup = styled.div<{ $isPopupOpen: boolean }>`
  position: absolute;
  display: ${({ $isPopupOpen }) => ($isPopupOpen ? 'flex' : 'none')};
  flex-direction: row;
  align-items: center;
  justify-content: center;

  top: 125px;
  left: 0;
  right: 0;
  padding-left: 50px;
  padding-right: 15px;
  width: 100%;
  height: 25px;
  background-color: rgba(255, 0, 0, 0.5);

  p {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;

    font-size: 14px;
    font-weight: 550;
    color: #ffffff;
    background-color: transparent;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: break-word;
    height: 100%;
    gap: 4px;

    u {
      display: flex;
      text-align: center;
      justify-content: center;
      align-items: center;

      cursor: pointer;
      font-size: 14px;
      font-weight: 550;
      color: #ffffff;
      background-color: transparent;
      text-overflow: clip;
    }
  }

  svg {
    cursor: pointer;
    width: 25px;
    height: 25px;

    :hover {
      circle {
        transition: fill 1s ease;
        fill: #00b5c0;
      }
    }
  }
  z-index: 50;

  @media (max-width: 768px) {
    height: 250px;
    padding: 0;

    p {
      padding-left: 5px;
      font-size: 12px;
      margin-top: 150px;
      height: 150px;

      u {
        font-size: 12px;
      }
    }

    svg {
      padding-right: 5px;
      margin-top: 150px;
    }
  }
`;
