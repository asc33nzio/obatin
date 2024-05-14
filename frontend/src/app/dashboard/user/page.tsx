'use client';
import '@/styles/pages/dashboard/datePicker.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'moment/locale/id';
import {
  AddressContainer,
  AddressHeader,
  DashboardPageContainer,
  DashboardPageContentContainer,
  GenderSelect,
  ImgBg,
  ProfileContainer,
  ProfileContent,
  ProfileContentLeft,
  ProfileContentRight,
  ProfileContentSeparator,
  ProfileHeader,
  ProfileHeaderButtonsDiv,
  UserDetailDiv,
} from '@/styles/pages/dashboard/Dashboard.styles';
import { EditProfileStateItf, GenderItf } from '@/types/dashboardTypes';
import { useState } from 'react';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useUploadValidation } from '@/hooks/useUploadValidation';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { debounce } from '@/utils/debounceThrottle';
import { getCookie } from 'cookies-next';
import { setAuthState } from '@/redux/reducers/authSlice';
import { BounceLoader } from 'react-spinners';
import { navigateToTxHistory } from '@/app/actions';
import Navbar from '@/components/organisms/navbar/Navbar';
import CustomButton from '@/components/atoms/button/CustomButton';
import EditPencilICO from '@/assets/dashboard/EditPencilICO';
import RegularInput from '@/components/atoms/input/RegularInput';
import PasswordInput from '@/components/atoms/input/PasswordInput';
import AddressCard from '@/components/molecules/cards/AddressCard';
import DatePicker from 'react-date-picker';
import Axios from 'axios';
import Image from 'next/image';
import DefaultMaleAvatar from '@/assets/DefaultMaleAvatar.svg';
import DefaultFemaleAvatar from '@/assets/DefaultFemaleAvatar.svg';
import moment from 'moment';
moment.locale('id');

const UserDashboardPage = (): React.ReactElement => {
  const dispatch = useObatinDispatch();
  const userInfo = useObatinSelector((state) => state?.auth);
  const accessToken = getCookie('access_token');
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [isEditingField, setIsEditingField] = useState<EditProfileStateItf>({
    email: false,
    name: false,
    password: false,
    confirmPassword: false,
    gender: false,
    birthDate: false,
    avatar: false,
  });
  const [hasNewValue, setHasNewValue] = useState<EditProfileStateItf>({
    email: false,
    name: false,
    password: false,
    confirmPassword: false,
    gender: false,
    birthDate: false,
    avatar: false,
  });
  const { setToast } = useToast();
  const { openModal } = useModal();
  const { email, emailValidationError, handleEmailInputChange } =
    useEmailValidation();
  const {
    password,
    validatePassword,
    passwordValidationError,
    confirmPasswordValidationError,
    handlePasswordInputChange,
  } = usePasswordValidation();
  const { userUpload, userUploadValidationError, handleImageChange } =
    useUploadValidation();
  const [name, setName] = useState<string>('');
  const [nameValidationError, setNameValidationError] = useState<string>('');
  const [gender, setGender] = useState<GenderItf>({ isMale: true });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialPassCheckLoading, setIsInitialPassCheckLoading] =
    useState<boolean>(false);
  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];
  const [date, setDate] = useState<Value>(new Date());
  const currentYear = new Date().getFullYear();
  const dateRangeMin = new Date();
  dateRangeMin.setFullYear(currentYear - 100);
  const dateRangeMax = new Date();
  dateRangeMax.setFullYear(currentYear - 10);

  const validateName = (input: string) => {
    const sanitizedInput = input.trim();

    if (sanitizedInput.length < 3) {
      setNameValidationError('Nama harus lebih dari 3 karakter');
      return false;
    }

    setNameValidationError('');
    return true;
  };

  const handleNameInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (validateName(event.target.value)) {
        setName(event.target.value);
      }
    },
    750,
  );

  const openPasswordInterface = async () => {
    setIsEditingField((prevState) => ({
      ...prevState,
      password: true,
    }));
  };

  const openConfirmPasswordInterface = async () => {
    if (!validatePassword(password)) return;

    const payload = {
      email: userInfo?.email,
      password: password,
    };

    try {
      setIsInitialPassCheckLoading(true);
      await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        payload,
      );
    } catch (error: any) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Kata sandi lama anda salah',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    } finally {
      setIsInitialPassCheckLoading(false);

      setIsEditingField((prevState) => ({
        ...prevState,
        password: false,
        confirmPassword: true,
      }));
    }

    if (password && !passwordValidationError) {
      openModal('confirm-password');
    }
  };

  const closePasswordInterface = () => {
    if (passwordValidationError || confirmPasswordValidationError) {
      setToast({
        showToast: true,
        toastMessage: 'Tolong cek kembali sandi anda',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }

    setIsEditingField((prevState) => ({
      ...prevState,
      password: false,
      confirmPassword: false,
    }));
  };

  const handleDateChange = (value: Value) => {
    const originalValue = userInfo?.birthDate;

    if (!value) return;

    if (value === originalValue) {
      setToast({
        showToast: true,
        toastMessage: 'Tidak ada perubahan',
        toastType: 'warning',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    setDate(value);
    setHasNewValue((prevState) => ({
      ...prevState,
      birthDate: true,
    }));
  };

  const handleUpdateUserProfile = async () => {
    if (!userInfo?.isVerified) {
      setToast({
        showToast: true,
        toastMessage: 'Maaf, anda belum melakukan verifikasi akun anda.',
        toastType: 'warning',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    const generalPayload = new FormData();
    // const emailPayload: Partial<EditProfilePayloadItf> = {};

    Object.keys(hasNewValue).forEach((key) => {
      if (hasNewValue[key as keyof EditProfileStateItf]) {
        switch (key) {
          case 'email':
            break;
          case 'name':
            generalPayload.append('name', name);
            break;
          case 'password':
            break;
          case 'confirmPassword':
            break;
          case 'gender':
            generalPayload.append(
              'gender',
              gender.isMale ? 'laki-laki' : 'perempuan',
            );
            break;
          case 'birthDate':
            if (date && date instanceof Date) {
              const formattedDate = moment(date).format().split('T')[0];
              generalPayload.append('birth_date', formattedDate);
            }
            break;
          case 'avatar':
            if (userUpload !== undefined) {
              generalPayload.append('avatar', userUpload);
            }
            break;
          default:
            break;
        }
      }
    });

    try {
      setIsLoading(true);
      const patchProfileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userInfo?.aid}`;
      // const patchEmailUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ping`;
      const userDetailUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userInfo?.aid}`;

      const patchProfileReq = await Axios.patch(
        patchProfileUrl,
        generalPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const getUserDetailReq = await Axios.get(userDetailUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // eslint-disable-next-line
      const [patchProfileRes, getUserDetailRes] = await Promise.all([
        patchProfileReq,
        getUserDetailReq,
      ]);

      const userData = getUserDetailRes.data.data;
      const oldUserData = userInfo;

      dispatch(
        setAuthState({
          aid: oldUserData.aid,
          email: userData.email,
          name: userData.name,
          gender: userData.gender,
          birthDate: userData.birth_date,
          role: oldUserData.role,
          avatarUrl: userData.avatar_url,
          isVerified: oldUserData.isVerified,
          isApproved: oldUserData.isApproved,
          activeAddressId: oldUserData.activeAddressId,
          addresses: oldUserData.addresses,
        }),
      );

      setToast({
        showToast: true,
        toastMessage: 'Pembaharuan profil sukses',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });

      handleResetStates();
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, pembaharuan profil gagal, mohon coba kembali',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetStates = () => {
    setIsEditingField({
      email: false,
      name: false,
      password: false,
      confirmPassword: false,
      gender: false,
      birthDate: false,
      avatar: false,
    });

    setHasNewValue({
      email: false,
      name: false,
      password: false,
      confirmPassword: false,
      gender: false,
      birthDate: false,
      avatar: false,
    });
  };

  return (
    <DashboardPageContainer $isDesktopDisplay={isDesktopDisplay}>
      <Navbar />

      <DashboardPageContentContainer>
        <ProfileContainer $isDesktopDisplay={isDesktopDisplay}>
          <ProfileHeader $isDesktopDisplay={isDesktopDisplay}>
            <h1>Profil</h1>

            <ProfileHeaderButtonsDiv>
              <CustomButton
                content='Riwayat Transaksi'
                $bgColor='#00B5C0'
                $width='150px'
                $height='50px'
                $fontSize='14px'
                onClick={() => navigateToTxHistory()}
              />
              <CustomButton
                content='Simpan Profil'
                $width='150px'
                $height='50px'
                $fontSize='14px'
                disabled={!Object.values(hasNewValue).some((value) => value)}
                onClick={handleUpdateUserProfile}
              />
            </ProfileHeaderButtonsDiv>
          </ProfileHeader>

          <ProfileContent $isDesktopDisplay={isDesktopDisplay}>
            <ProfileContentLeft $isDesktopDisplay={isDesktopDisplay}>
              <ImgBg>
                {isLoading ? (
                  <BounceLoader
                    size={265}
                    color='#00b5c0'
                    style={{
                      display: 'flex',
                      backgroundColor: 'transparent',
                    }}
                  />
                ) : userUpload !== undefined ? (
                  <Image
                    width={275}
                    height={275}
                    src={URL.createObjectURL(userUpload)}
                    alt='avatar'
                    priority
                  />
                ) : (
                  <Image
                    width={275}
                    height={275}
                    src={
                      userInfo?.avatarUrl !== ''
                        ? userInfo.avatarUrl
                        : userInfo?.gender === 'laki-laki'
                          ? DefaultMaleAvatar
                          : DefaultFemaleAvatar
                    }
                    alt='avatar'
                    priority
                  />
                )}
              </ImgBg>

              <RegularInput
                type='file'
                title=''
                placeholder='Pilih Foto'
                $width={45}
                $height={35}
                validationMessage={userUploadValidationError}
                $isSet={hasNewValue.avatar}
                onChange={(e) => {
                  handleImageChange(e);
                  if (!userUploadValidationError) {
                    setHasNewValue((prevState) => ({
                      ...prevState,
                      avatar: true,
                    }));
                  }
                }}
                $marBot={0}
                accept='image/*'
              />
            </ProfileContentLeft>

            {isDesktopDisplay && <ProfileContentSeparator />}

            <ProfileContentRight $isDesktopDisplay={isDesktopDisplay}>
              <h2>E-mail</h2>
              <UserDetailDiv>
                {isEditingField.email ? (
                  <>
                    <RegularInput
                      defaultValue={
                        userInfo?.email && !hasNewValue.email
                          ? userInfo?.email
                          : email
                      }
                      validationMessage={emailValidationError}
                      onChange={handleEmailInputChange}
                      $height={60}
                      $marBot={0}
                      title=''
                      placeholder=''
                    />
                    <EditPencilICO
                      isEditSuccessful={hasNewValue.email}
                      onClick={() => {
                        setIsEditingField((prevState) => ({
                          ...prevState,
                          email: false,
                        }));

                        if (email.trim() === '') {
                          setToast({
                            showToast: true,
                            toastMessage: 'Tidak ada perubahan',
                            toastType: 'warning',
                            resolution: isDesktopDisplay ? 'desktop' : 'mobile',
                            orientation: 'center',
                          });
                          return;
                        }

                        if (!emailValidationError) {
                          setHasNewValue((prevState) => ({
                            ...prevState,
                            email: true,
                          }));
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <span>
                      {hasNewValue.email
                        ? email
                        : userInfo?.email
                          ? userInfo?.email
                          : ''}
                    </span>
                    <EditPencilICO
                      isEditSuccessful={hasNewValue.email}
                      onClick={() =>
                        setIsEditingField((prevState) => ({
                          ...prevState,
                          email: true,
                        }))
                      }
                    />
                  </>
                )}
              </UserDetailDiv>

              <h2>Nama</h2>
              <UserDetailDiv>
                {isEditingField.name ? (
                  <>
                    <RegularInput
                      defaultValue={
                        userInfo?.name && !hasNewValue.name
                          ? userInfo?.name
                          : name
                      }
                      validationMessage={nameValidationError}
                      onChange={handleNameInputChange}
                      $height={60}
                      $marBot={0}
                      title=''
                      placeholder=''
                    />
                    <EditPencilICO
                      isEditSuccessful={false}
                      onClick={() => {
                        setIsEditingField((prevState) => ({
                          ...prevState,
                          name: false,
                        }));

                        if (name.trim() === '') {
                          setToast({
                            showToast: true,
                            toastMessage: 'Tidak ada perubahan',
                            toastType: 'warning',
                            resolution: isDesktopDisplay ? 'desktop' : 'mobile',
                            orientation: 'center',
                          });
                          return;
                        }

                        if (!nameValidationError) {
                          setHasNewValue((prevState) => ({
                            ...prevState,
                            name: true,
                          }));
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <span>
                      {hasNewValue.name
                        ? name
                        : userInfo?.name
                          ? userInfo?.name
                          : ''}
                    </span>
                    <EditPencilICO
                      isEditSuccessful={hasNewValue.name}
                      onClick={() =>
                        setIsEditingField((prevState) => ({
                          ...prevState,
                          name: true,
                        }))
                      }
                    />
                  </>
                )}
              </UserDetailDiv>

              <h2>Password</h2>
              <UserDetailDiv>
                {isEditingField.password && passwordValidationError ? (
                  <>
                    <PasswordInput
                      validationMessage={passwordValidationError}
                      onChange={handlePasswordInputChange}
                      title=''
                      placeholder=''
                      $height={60}
                      $viewBox='0 0 22 22'
                      $viewBoxHide='0 2 22 22'
                    />
                    <EditPencilICO
                      isEditSuccessful={false}
                      onClick={() => closePasswordInterface()}
                    />
                  </>
                ) : isEditingField.password ? (
                  <>
                    <PasswordInput
                      validationMessage={passwordValidationError}
                      onChange={handlePasswordInputChange}
                      title=''
                      placeholder='Masukkan kata sandi lama anda'
                      $height={60}
                      $viewBox='0 0 22 22'
                      $viewBoxHide='0 2 22 22'
                    />
                    <EditPencilICO
                      isEditSuccessful={false}
                      onClick={
                        isInitialPassCheckLoading
                          ? () => {}
                          : () => openConfirmPasswordInterface()
                      }
                    />
                  </>
                ) : (
                  <>
                    <span>***************</span>
                    <EditPencilICO
                      isEditSuccessful={false}
                      onClick={() => openPasswordInterface()}
                    />
                  </>
                )}
              </UserDetailDiv>

              <h2>Kelamin</h2>
              <UserDetailDiv>
                {isEditingField.gender ? (
                  <>
                    <GenderSelect
                      defaultValue={gender.isMale ? 1 : 0}
                      onChange={(
                        event: React.ChangeEvent<HTMLSelectElement>,
                      ) => {
                        const isMale = parseInt(event.target.value, 10);
                        setGender(
                          isMale ? { isMale: true } : { isMale: false },
                        );
                      }}
                    >
                      <option id='maleOption' value={1}>
                        laki-laki
                      </option>
                      <option id='femaleOption' value={0}>
                        perempuan
                      </option>
                    </GenderSelect>
                    <EditPencilICO
                      isEditSuccessful={false}
                      onClick={() => {
                        let isMale: boolean;
                        userInfo?.gender === 'laki-laki'
                          ? (isMale = true)
                          : (isMale = false);

                        if (isMale !== gender.isMale) {
                          setHasNewValue((prevState) => ({
                            ...prevState,
                            gender: true,
                          }));
                        }

                        setIsEditingField((prevState) => ({
                          ...prevState,
                          gender: false,
                        }));
                      }}
                    />
                  </>
                ) : (
                  <>
                    <span>
                      {hasNewValue.gender && gender.isMale
                        ? 'laki - laki'
                        : hasNewValue.gender && !gender.isMale
                          ? 'perempuan'
                          : userInfo?.gender
                            ? userInfo?.gender
                            : 'laki - laki'}
                    </span>
                    <EditPencilICO
                      isEditSuccessful={hasNewValue.gender}
                      onClick={() =>
                        setIsEditingField((prevState) => ({
                          ...prevState,
                          gender: true,
                        }))
                      }
                    />
                  </>
                )}
              </UserDetailDiv>

              <h2>Tanggal Lahir</h2>
              <UserDetailDiv>
                {isEditingField.birthDate ? (
                  <>
                    <DatePicker
                      className='date-picker-custom-style'
                      minDate={dateRangeMin}
                      maxDate={dateRangeMax}
                      format='ddMMMMyyy'
                      value={date}
                      onChange={handleDateChange}
                    />
                    <EditPencilICO
                      isEditSuccessful={false}
                      onClick={() => {
                        setIsEditingField((prevState) => ({
                          ...prevState,
                          birthDate: false,
                        }));
                      }}
                    />
                  </>
                ) : (
                  <>
                    <span>
                      {hasNewValue.birthDate && date instanceof Date
                        ? moment(date).format('dddd, Do MMMM YYYY')
                        : userInfo?.birthDate && date instanceof Date
                          ? moment(userInfo?.birthDate).format(
                              'dddd, Do MMMM YYYY',
                            )
                          : '-'}
                    </span>
                    <EditPencilICO
                      isEditSuccessful={hasNewValue.birthDate}
                      onClick={() =>
                        setIsEditingField((prevState) => ({
                          ...prevState,
                          birthDate: true,
                        }))
                      }
                    />
                  </>
                )}
              </UserDetailDiv>
            </ProfileContentRight>
          </ProfileContent>
        </ProfileContainer>

        <AddressContainer $isDesktopDisplay={isDesktopDisplay}>
          <AddressHeader>
            <h1>Alamat</h1>
            <CustomButton
              content='Tambah Alamat'
              $bgColor='#00B5C0'
              $width='150px'
              $height='35px'
              $fontSize='18px'
              onClick={() => openModal('add-address')}
            />
          </AddressHeader>

          {userInfo?.addresses?.map((address, index) => {
            if (!address.alias) return;
            let fullAddress = address.detail;
            fullAddress += `, ${address.city.province.name}, ${address.city.type} ${address.city.name}, ${address.city.postal_code}`;
            return (
              <AddressCard
                $id={address.id === null ? 0 : address.id}
                key={`userAddressCard${index}`}
                isMainAddress={userInfo?.activeAddressId === address.id}
                alias={address.alias}
                details={fullAddress}
              />
            );
          })}
        </AddressContainer>
      </DashboardPageContentContainer>
    </DashboardPageContainer>
  );
};

export default UserDashboardPage;
