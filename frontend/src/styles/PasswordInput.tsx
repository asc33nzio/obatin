import styled from 'styled-components';

export const PasswordInputContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100px;
  gap: 5px;

  background-color: yellow;
  font-size: 18px;
  color: #718096;

  margin-bottom: 25px;
`;

export const PasswordInputSubcontainer = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: center;

  background-color: blue;
  width: 100%;
  height: 80%;
`;

export const PasswordCustomInput = styled.input`
  width: 100%;
  height: 100%;

  background-color: #f7fafc;
  border: 1px solid #d0d9e3;
  border-radius: 10px;
  outline: none;
  padding-left: 15px;

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
