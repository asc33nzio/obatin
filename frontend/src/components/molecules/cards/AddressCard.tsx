import {
  AddressCardContainer,
  AddressCardLeftSection,
  AddressCardRightSection,
  AddressCardHeader,
  AddressDetails,
  IsMainAddressBadge,
} from '@/styles/pages/dashboard/AddressCard.styles';
import DeleteICO from '@/assets/dashboard/DeleteICO';
import EditICO from '@/assets/dashboard/EditICO';

const AddressCard = (props: {
  isMainAddress: boolean;
  alias: string;
  details: string;
}): React.ReactElement => {
  return (
    <AddressCardContainer>
      <AddressCardLeftSection>
        <AddressCardHeader>
          <h1>{props.alias}</h1>
          {props.isMainAddress && (
            <IsMainAddressBadge>UTAMA</IsMainAddressBadge>
          )}
        </AddressCardHeader>

        <AddressDetails>{props.details}</AddressDetails>
      </AddressCardLeftSection>

      <AddressCardRightSection>
        <DeleteICO />
        <EditICO />
      </AddressCardRightSection>
    </AddressCardContainer>
  );
};

export default AddressCard;
