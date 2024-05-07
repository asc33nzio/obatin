import CustomButton from '@/components/atoms/button/CustomButton';
import RegularInput from '@/components/atoms/input/RegularInput';
import React from 'react';

const PersonalInfoForm = () => {
  return (
    <>
      <RegularInput placeholder='Full Name' validationMessage='' />
      <RegularInput
        placeholder='Contact'
        validationMessage='enter your phone number'
      />
      <RegularInput placeholder='Email' validationMessage='enter your email' />
      <CustomButton
        content='simpan personal info'
        $fontSize='16px'
        $width='300px'
      />
    </>
  );
};

export default PersonalInfoForm;
