import { useModal } from '@/hooks/useModal';
import RegularInput from '@/components/atoms/input/RegularInput';
import {
  ImageContainer,
  UploadModalContainer,
} from '@/styles/organisms/modal/modalContent/UploadPayment.styles';
import React from 'react';
// import { useUploadValidation } from '@/hooks/useUploadValidation';
import Image from 'next/image';
import CustomButton from '@/components/atoms/button/CustomButton';
const UploadPembayaranModal = (): React.ReactElement => {
  const { closeModal } = useModal();
//   const handlePdfChange = useUploadValidation();

  return (
    <UploadModalContainer>
      <RegularInput
        type='file'
        placeholder='Unggah file'
        // validationMessage={useUploadValidation}
        // onChange={handlePdfChange}
        $width={40}
        accept='image/*,.pdf'
        // $fontSize={12}
      />
      <ImageContainer>
        <Image src='' width={300} height={300} alt='bukti' />
      </ImageContainer>
      <CustomButton
        $width='250px'
        $fontSize='16px'
        content='Unggah Bukti Pembayaran'
        onClick={() => closeModal()}
      />
    </UploadModalContainer>
  );
};

export default UploadPembayaranModal;
