import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 30%;
  height: 50px;
  padding: 20px;
  gap: 20px;
  border: 0.5px solid ${COLORS.input_border};
  border-radius: 12px;
  box-shadow: 2px 3px 5px gray;

  svg {
    cursor: pointer;
    object-fit: cover;
  }
  @media (max-width: 1440px) {
    width: 60vh;
  }
  @media (max-width: 768px) {
    width: 45vh;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 18px;
`;

export const SearchResultStack = styled.div`
  position: absolute;
  width: 100%;
  height: 400px;

  top: 110%;
  left: 0;

  border-radius: 12px;
  background: transparent;
  z-index: 50;
`;

export const SearchResult = styled.div<{
  $isLoader?: boolean;
  $is404?: boolean;
}>`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  height: 65px;
  margin-bottom: 2px;

  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: ${({ $is404 }) => ($is404 ? 'none' : '3px 15px 20px gray')};
  background-color: transparent;

  img {
    object-fit: cover;
    background: transparent;
  }

  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    overflow: hidden;
    text-overflow: ellipsis;

    width: 72%;
    height: 100%;
    font-size: 18px;
    font-weight: 200;
    background: #fff;
  }

  h2 {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    color: #fff;
    width: 100%;
    height: 100%;
    font-size: 18px;
    font-weight: 500;
    background: #00b5c0;
    border-radius: 12px;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    overflow: hidden;
    text-overflow: ellipsis;

    width: 17.5%;
    height: 100%;
    font-size: 25px;
    font-weight: 500;
    background-color: rgba(0, 181, 192, 1);
  }

  &:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom-left-radius: ${({ $isLoader }) => ($isLoader ? '12px' : '0')};
    border-bottom-right-radius: ${({ $isLoader }) =>
      $isLoader ? '12px' : '0'};
  }
`;

export const ExploreMore = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  box-shadow: 0px 0px 5px gray;
  height: 65px;
  font-weight: 500;

  overflow: hidden;
  text-overflow: ellipsis;
  background: ${COLORS.primary_color};
  box-shadow: 3px 10px 20px gray;

  span {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    color: #ffffff;
    background-color: transparent;
  }

  &:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`;
