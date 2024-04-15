import styled from 'styled-components';

export const PasswordInputContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100px;
  gap: 5px;

  font-size: 18px;
  color: #718096;

  margin-bottom: 25px;
`;

export const PasswordInputSubcontainer = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 80%;
`;

export const ICOdiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #f7fafc;
  width: 100px;
  height: 100%;

  border: 1px solid #d0d9e3;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left: none;

  div {
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #f7fafc;
    width: 100%;
    height: 70%;
    border-left: 1px solid #d0d9e3;

    svg {
      cursor: pointer;
      background-color: #f7fafc;
      width: 70%;
      height: 70%;

      path {
        cursor: pointer;
        background-color: #f7fafc;  
        object-fit: cover;
      }
    }
  }
`;

export const PasswordCustomInput = styled.input`
  width: 100%;
  height: 100%;

  background-color: #f7fafc;
  color: #4a5568;
  border: 1px solid #d0d9e3;
  border-right: none;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  outline: none;
  padding-left: 15px;
  font-size: 17px;

  &::placeholder {
    color: #949fb3;
    font-size: 18px;
  }
`;

export const PasswordInputErrorDiv = styled.div<{ $hasError: boolean }>`
  width: 100%;
  height: 20%;

  font-size: 18px;
  color: #cc3535;

  opacity: ${({ $hasError }) => ($hasError ? 1 : 0)};
`;
