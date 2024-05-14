import 'primereact/resources/themes/lara-light-cyan/theme.css';
import {
  AddressCardContainer,
  AddressCardLeftSection,
  AddressCardRightSection,
  AddressCardHeader,
  AddressDetails,
  IsMainAddressBadge,
} from '@/styles/pages/dashboard/AddressCard.styles';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { getCookie } from 'cookies-next';
import { useToast } from '@/hooks/useToast';
import { useModal } from '@/hooks/useModal';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { setAuthState } from '@/redux/reducers/authSlice';
import { InputSwitch } from 'primereact/inputswitch';
import { resetPharmacyStates } from '@/redux/reducers/pharmacySlice';
import Axios from 'axios';
import DeleteICO from '@/assets/dashboard/DeleteICO';
import EditICO from '@/assets/dashboard/EditICO';

const AddressCard = (props: {
  $id: number;
  isMainAddress: boolean;
  alias: string | null;
  details: string | null;
  $justify?: string | undefined;
  $marBot?: number | undefined;
  $borderDisable?: boolean | undefined;
  $omitButtons?: boolean | undefined;
  $padding?: string | undefined;
  $fontSize?: number | undefined;
  $height?: number | undefined;
}): React.ReactElement => {
  const { setToast } = useToast();
  const { openModal } = useModal();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const dispatch = useObatinDispatch();
  const userInfo = useObatinSelector((state) => state?.auth);
  const accessToken = getCookie('access_token');

  const handleOpenUpdateInterface = () => {
    sessionStorage.setItem('puID', props?.$id.toString());
    openModal('update-address');
  };

  const handleDelete = async () => {
    try {
      if (userInfo.activeAddressId === props.$id)
        throw new Error(`Main address can't be deleted`);

      await Axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userInfo?.aid}/addresses/${props.$id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const userDetailUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userInfo?.aid}`;
      const getNewUserDetailReq = await Axios.get(userDetailUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const newUserData = getNewUserDetailReq.data.data;

      dispatch(
        setAuthState({
          aid: userInfo.aid,
          email: userInfo.email,
          name: userInfo.name,
          gender: userInfo.gender,
          birthDate: userInfo.birthDate,
          role: userInfo.role,
          avatarUrl: userInfo.avatarUrl,
          isVerified: userInfo.isVerified,
          isApproved: userInfo.isApproved,
          activeAddressId: userInfo.activeAddressId,
          addresses: newUserData.addresses,
        }),
      );

      setToast({
        showToast: true,
        toastMessage: 'Alamat berhasil dihapus',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } catch (error: any) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: error.message
          ? 'Alamat utama tidak bisa dihapus'
          : 'Maaf, mohon coba kembali',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  const handleSetMainAddress = async () => {
    try {
      if (props.isMainAddress)
        throw new Error(`Current address is already the main address`);

      const payload = new FormData();
      payload.append('active_address_id', props.$id?.toString());

      await Axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userInfo?.aid}`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const userDetailUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userInfo?.aid}`;
      const getNewUserDetailReq = await Axios.get(userDetailUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const newUserData = getNewUserDetailReq.data.data;
      dispatch(
        setAuthState({
          aid: userInfo.aid,
          email: userInfo.email,
          name: userInfo.name,
          gender: userInfo.gender,
          birthDate: userInfo.birthDate,
          role: userInfo.role,
          avatarUrl: userInfo.avatarUrl,
          isVerified: userInfo.isVerified,
          isApproved: userInfo.isApproved,
          activeAddressId: newUserData.active_address_id,
          addresses: newUserData.addresses,
        }),
      );

      dispatch(resetPharmacyStates());

      setToast({
        showToast: true,
        toastMessage: `Sukses merubah ${props.alias} menjadi alamat utama`,
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } catch (error: any) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: error.message
          ? `${props.alias} sudah menjadi alamat utama`
          : `Gagal merubah ${props.alias} menjadi alamat utama`,
        toastType: props.isMainAddress ? 'warning' : 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  return (
    <AddressCardContainer
      $justify={props.$justify}
      $marBot={props.$marBot}
      $disableBorder={props.$borderDisable}
      $padding={props.$padding}
      $height={props.$height}
    >
      <AddressCardLeftSection>
        <AddressCardHeader $fontSize={props.$fontSize}>
          <h1>{props.alias}</h1>
          {userInfo?.activeAddressId === props.$id && props.isMainAddress && (
            <IsMainAddressBadge>UTAMA</IsMainAddressBadge>
          )}
        </AddressCardHeader>

        <AddressDetails>{props.details}</AddressDetails>
      </AddressCardLeftSection>

      {!props.$omitButtons ? (
        <AddressCardRightSection>
          <DeleteICO onClick={handleDelete} />
          <EditICO onClick={handleOpenUpdateInterface} />
          <InputSwitch
            checked={userInfo?.activeAddressId === props.$id}
            onChange={handleSetMainAddress}
          />
        </AddressCardRightSection>
      ) : (
        <AddressCardRightSection>
          <InputSwitch
            checked={userInfo?.activeAddressId === props.$id}
            onChange={handleSetMainAddress}
          />
        </AddressCardRightSection>
      )}
    </AddressCardContainer>
  );
};

export default AddressCard;
