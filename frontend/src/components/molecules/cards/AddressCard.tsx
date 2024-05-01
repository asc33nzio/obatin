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
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { setAuthState } from '@/redux/reducers/authSlice';
import Axios from 'axios';
import DeleteICO from '@/assets/dashboard/DeleteICO';
import EditICO from '@/assets/dashboard/EditICO';

const AddressCard = (props: {
  $id: number;
  isMainAddress: boolean;
  alias: string | null;
  details: string | null;
}): React.ReactElement => {
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const dispatch = useObatinDispatch();
  const userInfo = useObatinSelector((state) => state?.auth);
  const accessToken = getCookie('access_token');

  const handleDelete = async () => {
    try {
      if (props.isMainAddress) throw new Error(`Main address can't be deleted`);

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
        <DeleteICO onClick={handleDelete} />
        <EditICO />
      </AddressCardRightSection>
    </AddressCardContainer>
  );
};

export default AddressCard;
