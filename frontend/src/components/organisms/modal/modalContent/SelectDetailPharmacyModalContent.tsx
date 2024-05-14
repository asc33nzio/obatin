import LocationICO from '@/assets/icons/LocationICO';
import {
  DetailPharmacyContainer,
  DetailSec,
  DetailSecRow,
} from '@/styles/organisms/modal/modalContent/DetailPharmacy.styles';
import { PharmacyItf } from '@/types/pharmacyTypes';

const SelectDetailPharmacyModalContent = (props: {
  $pharmacyDetail: PharmacyItf | undefined;
}): React.ReactElement => {
  return (
    <DetailPharmacyContainer>
      <h2>{props.$pharmacyDetail?.name}</h2>
      <DetailSecRow>
        <LocationICO />
        <div>
          <p> {props.$pharmacyDetail?.address},</p>
          <p>{props.$pharmacyDetail?.distance} km dari alamatmu</p>
        </div>
      </DetailSecRow>
      <DetailSec>
        <p>Nama Apoteker: {props.$pharmacyDetail?.pharmacist_name}</p>
        <p>Kontak: {props.$pharmacyDetail?.pharmacist_phone}</p>
        <p>Lisensi: {props.$pharmacyDetail?.pharmacist_license}</p>
      </DetailSec>
      <DetailSec>
        <p>
          Hari operasional:{' '}
          {props.$pharmacyDetail?.operational_days?.join(', ')}
        </p>
        <p>Jam buka: {props.$pharmacyDetail?.opening_time} WIB</p>
        <p>Jam tutup: {props.$pharmacyDetail?.closing_time} WIB</p>
      </DetailSec>
    </DetailPharmacyContainer>
  );
};

export default SelectDetailPharmacyModalContent;
