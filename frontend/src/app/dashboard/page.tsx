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
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { navigateToLogin } from '../actions';
import { useEffect, useState } from 'react';
import { DecodedJwtItf } from '@/types/jwtTypes';
import {
  DatePickerType,
  EditProfileStateItf,
  GenderItf,
} from '@/types/dashboardTypes';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
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
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [userRole, setUserRole] = useState<string>('');
  const [isNavbarExpanded, setisNavbarExpanded] = useState<boolean>(false);
  const [editingFields, setEditingFields] = useState<EditProfileStateItf>({
    email: false,
    name: false,
    password: false,
    gender: false,
    birthDate: false,
  });
  const { email, emailValidationError, handleEmailInputChange } =
    useEmailValidation();
  const { password, passwordValidationError, handlePasswordInputChange } =
    usePasswordValidation();
  const [name, setName] = useState<string>('');
  const [nameValidationError, setNameValidationError] = useState<string>('');
  const [gender, setGender] = useState<GenderItf>({ isMale: undefined });
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

  // const handleEditChange = (
  //   prevState: SetStateAction<EditProfileStateItf>,
  //   field: EditProfileStateItf,
  // ) => {
  //   setEditingFields((prevState) => {
  //     ...prevState,
  //     field = true
  //   });
  // };

  const handleDateChange = (value: DatePickerType) => {
    setDate(value);
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
              <span>
                Besar file: maksimum 500 Kb. Ekstensi file yang diperbolehkan:
                .JPG .JPEG .PNG .SVG .WEBP
              </span>
              <CustomButton
                content='Pilih Foto'
                $bgColor='#00B5C0'
                $width='175px'
                $height='50px'
                $fontSize='22px'
              />
            </ProfileContentLeft>

            {isDesktopDisplay && <ProfileContentSeparator />}

            <ProfileContentRight $isDesktopDisplay={isDesktopDisplay}>
              <h2>E-mail</h2>
              <UserDetailDiv>
                {editingFields.email ? (
                  <>
                    <RegularInput
                      defaultValue={email}
                      validationMessage={emailValidationError}
                      onChange={handleEmailInputChange}
                      $height={60}
                      $marBot={0}
                      title=''
                      placeholder=''
                    />
                    <EditPencilICO
                      onClick={() =>
                        setEditingFields((prevState) => ({
                          ...prevState,
                          email: false,
                        }))
                      }
                    />
                  </>
                ) : (
                  <>
                    <span>{email}</span>
                    <EditPencilICO
                      onClick={() =>
                        setEditingFields((prevState) => ({
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
                {editingFields.name ? (
                  <>
                    <RegularInput
                      defaultValue={name}
                      validationMessage={nameValidationError}
                      onChange={handleNameInputChange}
                      $height={60}
                      $marBot={0}
                      title=''
                      placeholder=''
                    />
                    <EditPencilICO
                      onClick={() =>
                        setEditingFields((prevState) => ({
                          ...prevState,
                          name: false,
                        }))
                      }
                    />
                  </>
                ) : (
                  <>
                    <span>{name}</span>
                    <EditPencilICO
                      onClick={() =>
                        setEditingFields((prevState) => ({
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
                {editingFields.password ? (
                  <>
                    <PasswordInput
                      defaultValue={password}
                      validationMessage={passwordValidationError}
                      onChange={handlePasswordInputChange}
                      title=''
                      placeholder=''
                      $height={60}
                      $viewBox='0 0 22 22'
                      $viewBoxHide='0 2 22 22'
                    />
                    <EditPencilICO
                      onClick={() =>
                        setEditingFields((prevState) => ({
                          ...prevState,
                          password: false,
                        }))
                      }
                    />
                  </>
                ) : (
                  <>
                    <span>***************</span>
                    <EditPencilICO
                      onClick={() =>
                        setEditingFields((prevState) => ({
                          ...prevState,
                          password: true,
                        }))
                      }
                    />
                  </>
                )}
              </UserDetailDiv>

              <h2>Kelamin</h2>
              <UserDetailDiv>
                {editingFields.gender ? (
                  <>
                    <GenderSelect defaultValue={gender.isMale ? 1 : 0}>
                      <option id='maleOption' value={1}>
                        laki-laki
                      </option>
                      <option id='femaleOption' value={0}>
                        perempuan
                      </option>
                    </GenderSelect>
                    <EditPencilICO
                      onClick={() =>
                        setEditingFields((prevState) => ({
                          ...prevState,
                          gender: false,
                        }))
                      }
                    />
                  </>
                ) : (
                  <>
                    <span>
                      {gender.isMale === undefined
                        ? null
                        : gender.isMale
                        ? 'Laki-laki'
                        : 'Perempuan'}
                    </span>
                    <EditPencilICO
                      onClick={() =>
                        setEditingFields((prevState) => ({
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
                {editingFields.birthDate ? (
                  <>
                    <DatePicker
                      className='date-picker-custom-style'
                      minDate={dateRangeMin}
                      maxDate={dateRangeMax}
                      format='dd-MMMM-yyy'
                      value={date}
                      onChange={handleDateChange}
                    />
                    <EditPencilICO
                      onClick={() =>
                        setEditingFields((prevState) => ({
                          ...prevState,
                          birthDate: false,
                        }))
                      }
                    />
                  </>
                ) : (
                  <>
                    <span>
                      7 Juli 2000
                    </span>
                    <EditPencilICO
                      onClick={() =>
                        setEditingFields((prevState) => ({
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
