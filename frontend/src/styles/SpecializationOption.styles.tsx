import styled from 'styled-components';

export const SpecializationSelectContainer = styled.div<{ $marBot: number }>`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100px;
  gap: 5px;

  font-size: 18px;
  color: #718096;

  margin-bottom: ${({ $marBot }) => `${$marBot}px`};
`;

export const TitleAndSearchDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  gap: 10px;

  svg {
    cursor: pointer;
    object-fit: cover;
    width: 25px;
    height: 25px;
    background: transparent;
  }

  input {
    width: 80%;
    height: 100%;
    outline: none;
    border: 1px inset #00b5c0;
    border-radius: 10px;
    padding-left: 10px;
  }
`;

export const SpecializationCustomSelect = styled.select`
  width: 100%;
  height: 50%;

  background-color: #f7fafc;
  color: #4a5568;
  border-color: #d0d9e3;
  border-radius: 10px;
  outline: none;
  padding-left: 15px;
  font-size: 17px;

  cursor: pointer;
`;
