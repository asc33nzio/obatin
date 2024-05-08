import CustomButton from '@/components/atoms/button/CustomButton';
import { DoctorModalContainer } from '@/styles/organisms/modal/modalContent/DoctorDetailModalContent.styles';
import {
  Bold,
  Imagecontainer,
  Smallfont,
} from '@/styles/pages/product/ProductCard.styles';
import { Experience } from '@/styles/pages/product/ProductListPage.styles';
// import axios from 'axios';
import Image from 'next/image';
import React from 'react';

const DoctorDetailModalContent = (props: { $doctorDetail: any }) => {
  return (
    <>
      <DoctorModalContainer>
        <Imagecontainer>
          <Image
            width={150}
            height={150}
            src='https://unsplash.com/photos/FVh_yqLR9eA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGRvY3RvcnxlbnwwfHx8fDE3MTQ2NTQ1ODR8MA&force=true&w=1920'
            alt=''
          />
        </Imagecontainer>
        <Bold>{props.$doctorDetail?.name}</Bold>
        <Smallfont>{props.$doctorDetail?.specialization}</Smallfont>
        <Experience>
          {props.$doctorDetail?.experiences} tahun pengalaman
        </Experience>

        <Smallfont>
          Rp. {props.$doctorDetail?.fee?.toLocaleString('id-ID')},00
        </Smallfont>
        <Bold>Jadwal Operasional:</Bold>
        <Experience>{`${props.$doctorDetail?.operationalDays.join(', ')}`}</Experience>
        <Smallfont>{props.$doctorDetail?.operationalHours}</Smallfont>
        <CustomButton
          $width='150px'
          $height='32px'
          content='Hubungi Dokter'
          $fontSize='12px'
        />
      </DoctorModalContainer>
    </>
  );
};

export default DoctorDetailModalContent;
