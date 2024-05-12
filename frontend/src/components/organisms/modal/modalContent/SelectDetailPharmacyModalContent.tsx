import { DetailPharmacyContainer } from '@/styles/organisms/modal/modalContent/DetailPharmacy.styles';
import { PharmacyItf } from '@/types/pharmacyTypes';
import React from 'react';

const SelectDetailPharmacyModalContent = (props: {
  $pharmacyDetail: PharmacyItf | undefined;
}) => {
  return (
    <DetailPharmacyContainer>
      <h2>{props.$pharmacyDetail?.name}</h2>
      <p>Alamat: {props.$pharmacyDetail?.address}</p>
      <p>Jarak : {props.$pharmacyDetail?.distance} km dari alamat utamamu</p>
      <div>
        <p>Nama Apoteker: {props.$pharmacyDetail?.pharmacist_name}</p>
        <p>Kontak: {props.$pharmacyDetail?.pharmacist_phone}</p>
        <p>Lisensi: {props.$pharmacyDetail?.pharmacist_license}</p>
      </div>
      <div>
        <p>Hari operasional: {props.$pharmacyDetail?.operational_days}</p>
        <p>Jam buka: {props.$pharmacyDetail?.opening_time}</p>
        <p>Jam tutup: {props.$pharmacyDetail?.closing_time}</p>
      </div>
    </DetailPharmacyContainer>
  );
};

export default SelectDetailPharmacyModalContent;
