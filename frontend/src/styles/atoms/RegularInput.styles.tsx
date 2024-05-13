import styled from 'styled-components';

export const RegularInputContainer = styled.div<{
  $marBot?: number;
  $title?: string;
  $width?: number;
  $height?: number;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: ${({ $width }) => ($width ? `${$width}%` : '100%')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  gap: 5px;

  color: #718096;
  font-size: 18px;
  opacity: ${({ $title }) => ($title !== '' ? 1 : 0)};

  margin-bottom: ${({ $marBot }) => `${$marBot}px`};
`;

export const RegularCustomInput = styled.input<{
  $hasError?: boolean;
  $disabled?: boolean;
}>`
  width: 100%;
  height: 55%;

  background-color: ${({ $disabled }) => ($disabled ? '#918d8d' : '#f7fafc')};
  color: #4a5568;
  border: ${({ $hasError }) =>
    $hasError ? '1px solid #e04146' : '1px solid #d0d9e3'};
  border-radius: 10px;
  outline: none;
  padding-left: 15px;
  font-size: 17px;

  &::placeholder {
    color: ${({ $disabled }) => ($disabled ? '#ffffff' : '#949fb3')};
    font-size: 18px;
  }

  &[type='file'] {
    cursor: pointer;
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 85%;
    z-index: 2;
    font-size: 12px;
  }
`;

export const CustomUploadButton = styled.button<{
  $hasError?: boolean;
  $isSet?: boolean;
  $fontSize: number;
}>`
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: ${({ $hasError, $isSet }) =>
    $hasError ? '#e04146' : $isSet ? '#53BC38' : '#76D0F9'};
  border: none;
  outline: none;

  font-size: ${({ $fontSize }) => ($fontSize ? `${$fontSize}px` : '22px')};
  color: white;
  font-weight: 600;
  border: ${({ $hasError }) => ($hasError ? '1px solid #e04146' : 'none')};
  border-radius: 10px;
`;

export const RegularInputErrorDiv = styled.div<{ $hasError: boolean }>`
  width: 100%;
  height: 20%;

  font-size: 14px;
  color: #cc3535;
  padding-left: 10px;

  opacity: ${({ $hasError }) => ($hasError ? 1 : 0)};
`;
