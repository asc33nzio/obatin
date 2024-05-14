import React from 'react';
import styled from 'styled-components';
import ArrowLeft from '@/assets/arrows/LeftArrowICO';
import ArrowRight from '@/assets/arrows/RightArrowICO';

interface ButtonProp extends React.ComponentPropsWithoutRef<'button'> {
  buttonType: string;
}

const CustomButton = styled.button`
  background-color: #ede6e7;
  color: white;
  padding: 0em 1em;
  border-radius: 8px;
  outline: none;
  border: none;
  font-family: 'Poppins', sans-serif;
  &:hover {
    cursor: pointer;
  }
  &:disabled {
    cursor: initial;
    & svg {
      & path {
        stroke: #dedede;
      }
    }
  }
  svg {
    display: flex;
    align-items: start;
    justify-content: center;
    height: 30px;
    width: 100%;
  }
`;

function PaginateButton({
  buttonType,
  ...props
}: ButtonProp): React.ReactElement {
  return (
    <>
      {buttonType === 'next' ? (
        <CustomButton {...props}>
          <ArrowRight></ArrowRight>
        </CustomButton>
      ) : (
        <CustomButton {...props}>
          <ArrowLeft></ArrowLeft>
        </CustomButton>
      )}
    </>
  );
}

export default PaginateButton;
