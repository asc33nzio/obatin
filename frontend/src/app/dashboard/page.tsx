'use client';
import '@/styles/pages/dashboard/datePicker.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
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
  UserDetailDiv,
} from '@/styles/pages/dashboard/Dashboard.styles';
import {
  DatePickerType,
  EditProfileStateItf,
  GenderItf,
} from '@/types/dashboardTypes';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { navigateToLogin } from '../actions';
import { useEffect, useState } from 'react';
import { DecodedJwtItf } from '@/types/jwtTypes';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useUploadValidation } from '@/hooks/useUploadValidation';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useObatinSelector } from '@/redux/store/store';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { debounce } from '@/utils/debounce';
import Header from '@/components/organisms/navbar/Navbar';
import CustomButton from '@/components/atoms/button/CustomButton';
import PlaceholderAva from '@/assets/PlaceholderAva';
import EditPencilICO from '@/assets/dashboard/EditPencilICO';
import RegularInput from '@/components/atoms/input/RegularInput';
import PasswordInput from '@/components/atoms/input/PasswordInput';
import AddressCard from '@/components/molecules/cards/AddressCard';
import DatePicker from 'react-date-picker';

const DashboardPage = (): React.ReactElement => {
  const userInfo = useObatinSelector((state) => state?.auth);
  // const userName = useObatinSelector((state) => state.a);
  const { isDesktopDisplay } = useClientDisplayResolution();
  // eslint-disable-next-line
  const [userRole, setUserRole] = useState<string>('');
  const [isNavbarExpanded, setisNavbarExpanded] = useState<boolean>(false);
  const [isEditingField, setIsEditingField] = useState<EditProfileStateItf>({
    email: false,
    name: false,
    password: false,
    confirmPassword: false,
    gender: false,
    birthDate: false,
  });
  const [hasNewValue, setHasNewValue] = useState<EditProfileStateItf>({
    email: false,
    name: false,
    password: false,
    confirmPassword: false,
    gender: false,
    birthDate: false,
  });
  const { setToast } = useToast();
  const { openModal } = useModal();
  const { email, emailValidationError, handleEmailInputChange } =
    useEmailValidation();
  const {
    password,
    passwordValidationError,
    confirmPasswordValidationError,
    handlePasswordInputChange,
  } = usePasswordValidation();
  const {
    // eslint-disable-next-line
    userUpload,
    // eslint-disable-next-line
    setUserUpload,
    userUploadValidationError,
    // eslint-disable-next-line
    setUserUploadValidationError,
    // eslint-disable-next-line
    validateImageUpload,
    handleImageChange,
  } = useUploadValidation();
  const [name, setName] = useState<string>('');
  const [nameValidationError, setNameValidationError] = useState<string>('');
  // eslint-disable-next-line
  const [gender, setGender] = useState<GenderItf>({ isMale: true });
  const [date, setDate] = useState<DatePickerType>(new Date());
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

  //! AXIOS PATCH REQUEST
  // const handleEditChange = (
  //   prevState: SetStateAction<EditProfileStateItf>,
  //   field: EditProfileStateItf,
  // ) => {
  //   setIsEditingField((prevState) => {
  //     ...prevState,
  //     field = true
  //   });
  // };

  const openPasswordInterface = () => {
    setIsEditingField((prevState) => ({
      ...prevState,
      password: true,
    }));
  };

  const openConfirmPasswordInterface = () => {
    if (password && !passwordValidationError) {
      openModal('confirm-password');
    }

    setIsEditingField((prevState) => ({
      ...prevState,
      password: false,
      confirmPassword: true,
    }));
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

  const _handleDateChange = (selectedValue: Date) => {
    const originalValue = userInfo?.birthDate;

    if (selectedValue === originalValue) {
      setToast({
        showToast: true,
        toastMessage: 'Tidak ada perubahan',
        toastType: 'warning',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    setDate(selectedValue);
    setHasNewValue((prevState) => ({
      ...prevState,
      birthDate: true,
    }));
  };

  useEffect(() => {
    const isAuthenticatedCheck = () => {
      const sessionToken = getCookie('session_token');
      if (sessionToken === undefined) {
        navigateToLogin();
      } else {
        const decoded: DecodedJwtItf = jwtDecode(sessionToken);
        setUserRole(decoded.Payload.role);
      }
    };

    isAuthenticatedCheck();
  }, []);

  return (
    <DashboardPageContainer $isDesktopDisplay={isDesktopDisplay}>
      <Header
        isOpened={isNavbarExpanded}
        toggleDrawer={() => setisNavbarExpanded(!isNavbarExpanded)}
      />

      <DashboardPageContentContainer>
        <ProfileContainer $isDesktopDisplay={isDesktopDisplay}>
          <ProfileHeader $isDesktopDisplay={isDesktopDisplay}>
            <h1>Profil</h1>
            <CustomButton
              content='Simpan Profil'
              $bgColor='#cbd5e0'
              $width='150px'
              $height='35px'
              $fontSize='18px'
            />
          </ProfileHeader>

          <ProfileContent $isDesktopDisplay={isDesktopDisplay}>
            <ProfileContentLeft $isDesktopDisplay={isDesktopDisplay}>
              <ImgBg>
                <PlaceholderAva />
              </ImgBg>
              <span>Gambar Profil</span>
              <RegularInput
                type='file'
                title=''
                placeholder='Pilih Foto'
                $width={45}
                $height={35}
                validationMessage={userUploadValidationError}
                onChange={handleImageChange}
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
                        if (!emailValidationError) {
                          setHasNewValue((prevState) => ({
                            ...prevState,
                            email: true,
                          }));
                        }

                        setIsEditingField((prevState) => ({
                          ...prevState,
                          email: false,
                        }));
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
                        if (!nameValidationError) {
                          setHasNewValue((prevState) => ({
                            ...prevState,
                            name: true,
                          }));
                        }

                        setIsEditingField((prevState) => ({
                          ...prevState,
                          name: false,
                        }));
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
                      placeholder=''
                      $height={60}
                      $viewBox='0 0 22 22'
                      $viewBoxHide='0 2 22 22'
                    />
                    <EditPencilICO
                      isEditSuccessful={false}
                      onClick={() => openConfirmPasswordInterface()}
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
                      // onChange={handleDateChange}
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
                      {hasNewValue.birthDate
                        ? date
                            ?.toLocaleString()
                            .split(',')?.[0]
                            .replaceAll('/', '-')
                        : userInfo?.birthDate
                          ? userInfo?.birthDate
                              ?.toLocaleString()
                              ?.split('T')?.[0]
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
            <h1>Address</h1>
            <CustomButton
              content='Tambah Alamat'
              $bgColor='#00B5C0'
              $width='150px'
              $height='35px'
              $fontSize='18px'
            />
          </AddressHeader>

          <AddressCard
            isMainAddress={true}
            alias='Sopo Del Tower'
            details='Jl. Foo Bar'
          />
          <AddressCard
            isMainAddress={false}
            alias='Sopo Del Tower'
            details='Jl. Foo Bar'
          />
          <AddressCard
            isMainAddress={false}
            alias='Sopo Del Tower'
            details='Jl. Foo Bar'
          />
        </AddressContainer>
      </DashboardPageContentContainer>
    </DashboardPageContainer>
  );
};

export default DashboardPage;
