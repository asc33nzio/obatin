import { CustomButtonStyle } from '@/styles/CustomButton';
import React from 'react';

const CustomButton = (props: { content: string }): React.ReactElement => {
  return <CustomButtonStyle>
    {props.content}
  </CustomButtonStyle>;
};

export default CustomButton;
