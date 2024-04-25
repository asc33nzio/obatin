import styled from 'styled-components';

export const PasswordInputContainer = styled.div<{
  $height: number;
  $marBot?: number;
}>`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  gap: 5px;

  font-size: 18px;
  color: #718096;

  margin-bottom: ${({ $marBot }) => ($marBot ? `${$marBot}px` : '25px')};
`;

export const PasswordInputSubcontainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 50%;
`;

export const ICOdiv = styled.div<{ $hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: #f7fafc;
  width: 100px;
  height: 100%;

  border: ${({ $hasError }) =>
    $hasError ? '1px solid #e04146' : '1px solid #d0d9e3'};
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left: none;

  div {
    display: flex;
    align-items: center;
    justify-content: center;

    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;

    background-color: #f7fafc;
    width: 100%;
    height: 100%;
    border-left: 1px solid #d0d9e3;

    svg {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      margin: 10px 0px 0px;
      background: transparent;
      width: 75%;
      height: 75%;
      overflow: hidden;
      object-fit: cover;
      cursor: pointer;

      path {
        cursor: pointer;
        background-color: #f7fafc;
      }
    }
  }
`;

export const PasswordCustomInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  height: 100%;

  background-color: #f7fafc;
  color: #4a5568;
  border: ${({ $hasError }) =>
    $hasError ? '1px solid #e04146' : '1px solid #d0d9e3'};
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

  font-size: 14px;
  color: #cc3535;
  padding-left: 10px;

  opacity: ${({ $hasError }) => ($hasError ? 1 : 0)};
`;
