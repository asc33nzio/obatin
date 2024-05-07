import styled from 'styled-components';

export const RegularInputContainer = styled.div<{
  $marBot?: number;
  $title?: string;
  $width?: number;
  $height?: number;
  // $fontSize: number;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: ${({ $width }) => ($width ? `${$width}%` : '100%')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  gap: 5px;

  /* font-size: ${({ $fontSize }) =>
    $fontSize ? `${$fontSize}px` : '18px'}; */
  font-size: ${({ $fontSize }) => ($fontSize ? `${$fontSize}px` : '18px')};

  color: #718096;
  opacity: ${({ $title }) => ($title !== '' ? 1 : 0)};

  margin-bottom: ${({ $marBot }) => `${$marBot}px`};
`;

export const RegularCustomInput = styled.input<{
  $hasError?: boolean;
  $disabled?: boolean;
}>`
  width: 100%;
  height: 50%;

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
  }
`;

export const CustomUploadButton = styled.button<{
  $hasError?: boolean;
  $isSet?: boolean;
}>`
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: ${({ $hasError, $isSet }) =>
    $hasError ? '#e04146' : $isSet ? '#53BC38' : '#b3e5fc'};
  border: none;
  outline: none;

  font-size: 22px;
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
