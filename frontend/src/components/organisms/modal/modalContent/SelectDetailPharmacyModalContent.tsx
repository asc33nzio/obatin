import { PharmacyCart } from '@/redux/reducers/pharmacySlice';
import { DetailPharmacyContainer } from '@/styles/organisms/modal/modalContent/DetailPharmacy.styles';
import React from 'react';

const SelectDetailPharmacyModalContent = (props: {
  $pharmacyDetail: PharmacyCart | undefined;
}) => {
  return (
    <DetailPharmacyContainer>
      <h2>{props.$pharmacyDetail?.name}</h2>
      <p>Alamat: {props.$pharmacyDetail?.address}</p>
      <p>Jarak : {props.$pharmacyDetail?.distance}</p>
    </DetailPharmacyContainer>
  );
};

export default SelectDetailPharmacyModalContent;
