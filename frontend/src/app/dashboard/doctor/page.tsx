'use client';
import '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css';
import 'react-clock/dist/Clock.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'moment/locale/id';
import {
  DashboardPageContentContainer,
  DoctorDashboardPageContainer,
  ImgBg,
  DoctorProfileContainer,
  ProfileContent,
  ProfileContentLeft,
  ProfileContentRight,
  ProfileContentSeparator,
  ProfileHeader,
  ProfileHeaderButtonsDiv,
  UserDetailDiv,
  DoctorProgressContainer,
  ContentSubcontainer,
  ClockDiv,
  AltDetailDiv,
  RadioInputGroup,
} from '@/styles/pages/dashboard/Dashboard.styles';
import { EditProfileDoctorStateItf, TimeValue } from '@/types/dashboardTypes';
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
import { setAuthDoctorState } from '@/redux/reducers/authDoctorSlice';
import { BounceLoader } from 'react-spinners';
import { InputSwitch } from 'primereact/inputswitch';
import { ValidDays } from '@/types/reduxTypes';
import CustomButton from '@/components/atoms/button/CustomButton';
import EditPencilICO from '@/assets/dashboard/EditPencilICO';
import RegularInput from '@/components/atoms/input/RegularInput';
import PasswordInput from '@/components/atoms/input/PasswordInput';
import Axios from 'axios';
import Image from 'next/image';
import DefaultDoctorAvatar from '@/assets/DefaultDoctorAvatar.svg';
import ProgressBar from '@/components/atoms/progressBar/ProgressBar';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import moment from 'moment';
import NavbarDoctor from '@/components/organisms/navbar/NavbarDoctor';
moment.locale('id');

const DoctorDashboardPage = (): React.ReactElement => {
  const dispatch = useObatinDispatch();
  const doctorInfo = useObatinSelector((state) => state?.authDoctor);
  const accessToken = getCookie('access_token');
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [isEditingField, setIsEditingField] =
    useState<EditProfileDoctorStateItf>({
      email: false,
      name: false,
      password: false,
      confirmPassword: false,
      avatar: false,
      experiences: false,
      time: false,
      operationalDays: false,
      fee: false,
    });
  const [hasNewValue, setHasNewValue] = useState<EditProfileDoctorStateItf>({
    email: false,
    name: false,
    password: false,
    confirmPassword: false,
    avatar: false,
    experiences: false,
    time: false,
    operationalDays: false,
    fee: false,
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
  const [experiences, setExperiences] = useState<number>(0);
  const [experiencesValidationError, setExperiencesValidationError] =
    useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isToggleOnlineLoading, setIsToggleOnlineLoading] =
    useState<boolean>(false);
  const [isInitialPassCheckLoading, setIsInitialPassCheckLoading] =
    useState<boolean>(false);
  const [operationalDays, setOperationalDays] = useState<Array<ValidDays>>(
    doctorInfo?.operationalDays,
  );
  const [time, setTime] = useState<TimeValue>(['08:00', '17:30']);
  const [timeStart, setTimeStart] = useState<string>('');
  const [numHours, setNumHours] = useState<string>('');
  const [openingHour, openingMinute] = doctorInfo?.openingTime
    .split(':')
    .map(Number);
  const [operationalHour, operationalMinute] = doctorInfo?.operationalHours
    ?.split(':')
    .map(Number);
  const closingHour = (openingHour + operationalHour) % 24;
  const closingMinute = (openingMinute + operationalMinute) % 60;
  const formattedOpeningTime = `${doctorInfo?.openingTime?.split(':')[0]}:${doctorInfo?.openingTime?.split(':')[1]}`;
  const formattedClosingTime = `${closingHour < 10 ? '0' : ''}${closingHour}:${closingMinute < 10 ? '0' : ''}${closingMinute}`;
  const [fee, setFee] = useState<number>(0);
  const [feeValidationError, setFeeValidationError] = useState<string>('');

  const handleTimeChange = (value: TimeValue) => {
    if (!value) return;
    let timeStartString: string;
    let timeEndString: string;

    if (Array.isArray(value)) {
      timeStartString = value[0] as string;
      timeEndString = value[1] as string;
    } else {
      return;
    }
    const timeStart = new Date(`01/01/1970 ${timeStartString}`);
    const timeEnd = new Date(`01/01/1970 ${timeEndString}`);
    const delta = timeEnd.getTime() - timeStart.getTime();
    const deltaString = new Date(delta)?.toISOString()?.slice(11, -11);

    setTimeStart(timeStartString);
    setNumHours(deltaString);
    setTime(value);

    setHasNewValue((prevState) => ({
      ...prevState,
      time: true,
    }));
  };

  const handleOperationalDaysChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedDay = event.target.value as ValidDays;
    if (operationalDays.includes(selectedDay)) {
      const shallowCopy = operationalDays.filter((day) => day !== selectedDay);
      setOperationalDays(shallowCopy);
      setHasNewValue((prevState) => ({
        ...prevState,
        operationalDays: true,
      }));
      return;
    }

    setOperationalDays((prevState) => [...prevState, selectedDay]);
    setHasNewValue((prevState) => ({
      ...prevState,
      operationalDays: true,
    }));
  };

  const validateFee = (input: string) => {
    if (Number.isNaN(Number(input))) {
      setFeeValidationError('Upah harus berupa angka');
      return false;
    }

    if (parseInt(input, 10) < 10000) {
      setFeeValidationError('Upah harus lebih dari Rp. 10.000,00');
      return false;
    }

    if (parseInt(input, 10) > 2000000) {
      setFeeValidationError('Upah maksimum senilai Rp. 2.000.000,00');
      return false;
    }

    setFeeValidationError('');
    return true;
  };

  const handleFeeInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (validateFee(event.target.value)) {
        setFee(parseInt(event.target.value, 10));
      }
    },
    750,
  );

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

  const validateExperiences = (input: string) => {
    if (Number.isNaN(Number(input))) {
      setExperiencesValidationError('Tahun pengalaman harus berupa angka');
      return false;
    }

    const parsedInput = parseInt(input, 10);
    if (parsedInput < 0 || parsedInput > 60) {
      setExperiencesValidationError(
        'Tahun pengalaman harus diantara 0 - 60 tahun',
      );
      return false;
    }

    setExperiencesValidationError('');
    return true;
  };

  const handleExperiencesInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (validateExperiences(event.target.value)) {
        setExperiences(parseInt(event.target.value, 10));
      }
    },
    750,
  );

  const openPasswordInterface = async () => {
    if (!doctorInfo?.isVerified || !doctorInfo?.isApproved) {
      setToast({
        showToast: true,
        toastMessage: !doctorInfo?.isApproved
          ? 'Mohon menunggu persetujuan admin dan cek e-mail secara berkala'
          : 'Mohon lakukan verifikasi e-mail terlebih dahulu',
        toastType: 'warning',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    setIsEditingField((prevState) => ({
      ...prevState,
      password: true,
    }));
  };

  const openConfirmPasswordInterface = async () => {
    if (!validatePassword(password)) return;

    const payload = {
      email: doctorInfo?.email,
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
      openModal('confirm-password-doctor');
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

  const handleUpdateOnlineStatus = async () => {
    try {
      if (isToggleOnlineLoading) return;
      setIsToggleOnlineLoading(true);
      const payload = new FormData();
      payload.append('is_online', doctorInfo?.isOnline ? 'false' : 'true');
      await Axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${doctorInfo?.aid}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const response = await Axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/details`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const udpatedDoctorData = response?.data?.data;
      const oldDoctorData = doctorInfo;

      dispatch(
        setAuthDoctorState({
          aid: oldDoctorData.aid,
          email: udpatedDoctorData.email,
          name: udpatedDoctorData.name,
          role: oldDoctorData.role,
          isVerified: oldDoctorData.isVerified,
          isApproved: oldDoctorData.isApproved,
          avatarUrl: udpatedDoctorData.avatar_url,
          specialization: oldDoctorData.specialization,
          isOnline: udpatedDoctorData.is_online,
          experiences: udpatedDoctorData.experiences,
          certificate: oldDoctorData.certificate,
          fee: udpatedDoctorData.fee,
          openingTime: udpatedDoctorData.opening_time,
          operationalHours: udpatedDoctorData.operational_hours,
          operationalDays: udpatedDoctorData.operational_days,
        }),
      );

      setToast({
        showToast: true,
        toastMessage: doctorInfo?.isOnline
          ? 'Sukses mengubah status menjadi offline'
          : 'Sukses mengubah status menjadi online',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, gagal mengubah status, mohon coba kembali',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } finally {
      setIsToggleOnlineLoading(false);
    }
  };

  const handleUpdateDoctorProfile = async () => {
    if (!doctorInfo?.isVerified) {
      setToast({
        showToast: true,
        toastMessage: 'Maaf, lakukan verifikasi terlebih dahulu.',
        toastType: 'warning',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    const generalPayload = new FormData();
    // const emailPayload: Partial<EditProfilePayloadItf> = {};

    Object.keys(hasNewValue).forEach((key) => {
      if (hasNewValue[key as keyof EditProfileDoctorStateItf]) {
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
          case 'avatar':
            if (userUpload !== undefined) {
              generalPayload.append('avatar', userUpload);
            }
            break;
          case 'experiences':
            generalPayload.append('experiences', experiences?.toString());
            break;
          case 'time':
            generalPayload.append('opening_time', timeStart);
            generalPayload.append('operational_hours', numHours);
            break;
          case 'operationalDays':
            const convertedArr = operationalDays.toString();
            generalPayload.append('operational_days', convertedArr);
            break;
          case 'fee':
            generalPayload.append('fee', fee?.toString());
            break;
          default:
            break;
        }
      }
    });

    try {
      setIsLoading(true);
      const patchProfileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${doctorInfo?.aid}`;
      // const patchEmailUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ping`;
      const doctorDetailUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/details`;

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

      const getDoctorDetailReq = await Axios.get(doctorDetailUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // eslint-disable-next-line
      const [patchProfileRes, getDoctorDetailRes] = await Promise.all([
        patchProfileReq,
        getDoctorDetailReq,
      ]);

      const udpatedDoctorData = getDoctorDetailRes.data.data;
      const oldDoctorData = doctorInfo;

      dispatch(
        setAuthDoctorState({
          aid: oldDoctorData.aid,
          email: udpatedDoctorData.email,
          name: udpatedDoctorData.name,
          role: oldDoctorData.role,
          isVerified: oldDoctorData.isVerified,
          isApproved: oldDoctorData.isApproved,
          avatarUrl: udpatedDoctorData.avatar_url,
          specialization: oldDoctorData.specialization,
          isOnline: udpatedDoctorData.is_online,
          experiences: udpatedDoctorData.experiences,
          certificate: oldDoctorData.certificate,
          fee: udpatedDoctorData.fee,
          openingTime: udpatedDoctorData.opening_time,
          operationalHours: udpatedDoctorData.operational_hours,
          operationalDays: udpatedDoctorData.operational_days,
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

  const handleReverify = async () => {
    try {
      if (isProcessing) {
        setToast({
          showToast: true,
          toastMessage: 'Sedang diproses, mohon menunggu',
          toastType: 'warning',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      setIsProcessing(true);
      setToast({
        showToast: true,
        toastMessage: 'Mohon menunggu sejenak',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });

      await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify/mail`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setToast({
        showToast: true,
        toastMessage: 'E-mail verifikasi telah dikirim, cek e-mail anda',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, mohon coba kembali',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetStates = () => {
    setIsEditingField({
      email: false,
      name: false,
      password: false,
      confirmPassword: false,
      avatar: false,
      experiences: false,
      time: false,
      operationalDays: false,
      fee: false,
    });

    setHasNewValue({
      email: false,
      name: false,
      password: false,
      confirmPassword: false,
      avatar: false,
      experiences: false,
      time: false,
      operationalDays: false,
      fee: false,
    });
  };

  return (
    <DoctorDashboardPageContainer $isDesktopDisplay={isDesktopDisplay}>
      <NavbarDoctor />

      <DashboardPageContentContainer>
        <DoctorProfileContainer $isDesktopDisplay={isDesktopDisplay}>
          <ProfileHeader $isDesktopDisplay={isDesktopDisplay}>
            <h1>Profil</h1>

            <ProfileHeaderButtonsDiv>
              <CustomButton
                content='Simpan Profil'
                $width='150px'
                $height='40px'
                $fontSize='18px'
                disabled={!Object.values(hasNewValue).some((value) => value)}
                onClick={handleUpdateDoctorProfile}
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
                      doctorInfo?.avatarUrl !== ''
                        ? doctorInfo.avatarUrl
                        : DefaultDoctorAvatar
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
                        doctorInfo?.email && !hasNewValue.email
                          ? doctorInfo?.email
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
                        : doctorInfo?.email
                          ? doctorInfo?.email
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
                        doctorInfo?.name && !hasNewValue.name
                          ? doctorInfo?.name
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
                        : doctorInfo?.name
                          ? doctorInfo?.name
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

              <h2>Pengalaman</h2>
              <UserDetailDiv>
                {isEditingField.experiences ? (
                  <>
                    <RegularInput
                      defaultValue={
                        doctorInfo?.experiences && !hasNewValue.experiences
                          ? doctorInfo?.experiences
                          : experiences
                      }
                      validationMessage={experiencesValidationError}
                      onChange={handleExperiencesInputChange}
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
                          experiences: false,
                        }));

                        if (!experiences) {
                          setToast({
                            showToast: true,
                            toastMessage: 'Tidak ada perubahan',
                            toastType: 'warning',
                            resolution: isDesktopDisplay ? 'desktop' : 'mobile',
                            orientation: 'center',
                          });
                          return;
                        }

                        if (!experiencesValidationError) {
                          setHasNewValue((prevState) => ({
                            ...prevState,
                            experiences: true,
                          }));
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <span>
                      {hasNewValue.experiences
                        ? `${experiences} tahun`
                        : doctorInfo?.experiences
                          ? `${doctorInfo?.experiences} tahun`
                          : 0}
                    </span>
                    <EditPencilICO
                      isEditSuccessful={hasNewValue.experiences}
                      onClick={() =>
                        setIsEditingField((prevState) => ({
                          ...prevState,
                          experiences: true,
                        }))
                      }
                    />
                  </>
                )}
              </UserDetailDiv>

              <h2>Biaya Konsultasi</h2>
              <UserDetailDiv>
                {isEditingField.fee ? (
                  <>
                    <RegularInput
                      defaultValue={
                        doctorInfo?.fee && !hasNewValue.fee
                          ? doctorInfo?.fee
                          : fee
                      }
                      validationMessage={feeValidationError}
                      onChange={handleFeeInputChange}
                      $height={60}
                      $marBot={0}
                      title=''
                      placeholder='Rp. 10.000'
                      type='number'
                    />
                    <EditPencilICO
                      isEditSuccessful={false}
                      onClick={() => {
                        setIsEditingField((prevState) => ({
                          ...prevState,
                          fee: false,
                        }));

                        if (!fee) {
                          setToast({
                            showToast: true,
                            toastMessage: 'Tidak ada perubahan',
                            toastType: 'warning',
                            resolution: isDesktopDisplay ? 'desktop' : 'mobile',
                            orientation: 'center',
                          });
                          return;
                        }

                        if (!feeValidationError) {
                          setHasNewValue((prevState) => ({
                            ...prevState,
                            fee: true,
                          }));
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <span>
                      {hasNewValue.fee
                        ? `Rp. ${fee.toLocaleString('id-ID')},00`
                        : doctorInfo?.fee
                          ? `Rp. ${doctorInfo?.fee?.toLocaleString('id-ID')},00`
                          : `Rp. 0`}
                    </span>
                    <EditPencilICO
                      isEditSuccessful={hasNewValue.fee}
                      onClick={() =>
                        setIsEditingField((prevState) => ({
                          ...prevState,
                          fee: true,
                        }))
                      }
                    />
                  </>
                )}
              </UserDetailDiv>

              <h2>
                Spesialisasi <span>{doctorInfo?.specialization}</span>
              </h2>

              <h2>
                Online
                <InputSwitch
                  checked={doctorInfo?.isOnline}
                  onChange={handleUpdateOnlineStatus}
                />
              </h2>

              <h2>Waktu Praktek</h2>
              <AltDetailDiv>
                {isEditingField.time ? (
                  <>
                    <ClockDiv>
                      <TimeRangePicker
                        onChange={handleTimeChange}
                        value={time}
                        rangeDivider=''
                      />
                    </ClockDiv>
                    <EditPencilICO
                      isEditSuccessful={false}
                      onClick={() => {
                        setIsEditingField((prevState) => ({
                          ...prevState,
                          time: false,
                        }));
                      }}
                    />
                  </>
                ) : (
                  <>
                    <p>
                      {hasNewValue.time && Array.isArray(time)
                        ? `${time?.[0]!} - ${time?.[1]!}`
                        : doctorInfo?.openingTime
                          ? `${formattedOpeningTime} - ${formattedClosingTime}`
                          : 'Belum disetel'}
                    </p>
                    <EditPencilICO
                      isEditSuccessful={hasNewValue.time}
                      onClick={() =>
                        setIsEditingField((prevState) => ({
                          ...prevState,
                          time: true,
                        }))
                      }
                    />
                  </>
                )}
              </AltDetailDiv>

              <h2>Hari Praktek</h2>
              <RadioInputGroup>
                <div>
                  <input
                    type='checkbox'
                    id='senin'
                    name='senin'
                    value='senin'
                    defaultChecked={doctorInfo?.operationalDays?.includes(
                      'senin',
                    )}
                    onChange={(e) => handleOperationalDaysChange(e)}
                  />
                  <label htmlFor='senin'> Senin</label>
                </div>

                <div>
                  <input
                    type='checkbox'
                    id='selasa'
                    name='selasa'
                    value='selasa'
                    defaultChecked={doctorInfo?.operationalDays?.includes(
                      'selasa',
                    )}
                    onChange={(e) => handleOperationalDaysChange(e)}
                  />
                  <label htmlFor='selasa'> Selasa</label>
                </div>

                <div>
                  <input
                    type='checkbox'
                    id='rabu'
                    name='rabu'
                    value='rabu'
                    defaultChecked={doctorInfo?.operationalDays?.includes(
                      'rabu',
                    )}
                    onChange={(e) => handleOperationalDaysChange(e)}
                  />
                  <label htmlFor='rabu'> Rabu</label>
                </div>

                <div>
                  <input
                    type='checkbox'
                    id='kamis'
                    name='kamis'
                    value='kamis'
                    defaultChecked={doctorInfo?.operationalDays?.includes(
                      'kamis',
                    )}
                    onChange={(e) => handleOperationalDaysChange(e)}
                  />
                  <label htmlFor='kamis'> Kamis</label>
                </div>

                <div>
                  <input
                    type='checkbox'
                    id='jumat'
                    name='jumat'
                    value='jumat'
                    defaultChecked={doctorInfo?.operationalDays?.includes(
                      'jumat',
                    )}
                    onChange={(e) => handleOperationalDaysChange(e)}
                  />
                  <label htmlFor='jumat'> Jumat</label>
                </div>

                <div>
                  <input
                    type='checkbox'
                    id='sabtu'
                    name='sabtu'
                    value='sabtu'
                    defaultChecked={doctorInfo?.operationalDays?.includes(
                      'sabtu',
                    )}
                    onChange={(e) => handleOperationalDaysChange(e)}
                  />
                  <label htmlFor='sabtu'> Sabtu</label>
                </div>

                <div>
                  <input
                    type='checkbox'
                    id='minggu'
                    name='minggu'
                    value='minggu'
                    defaultChecked={doctorInfo?.operationalDays?.includes(
                      'minggu',
                    )}
                    onChange={(e) => handleOperationalDaysChange(e)}
                  />
                  <label htmlFor='minggu'> Minggu</label>
                </div>
              </RadioInputGroup>
            </ProfileContentRight>
          </ProfileContent>
        </DoctorProfileContainer>

        <DoctorProgressContainer>
          <ContentSubcontainer>
            <ProgressBar
              $progress={
                !doctorInfo?.isApproved
                  ? 25
                  : !doctorInfo?.isVerified
                    ? 50
                    : !doctorInfo?.avatarUrl
                      ? 75
                      : 100
              }
            />
            <p>
              {!doctorInfo?.isApproved ? (
                'Saat ini salah satu dari admin kami sedang mengulas aplikasi anda. Mohon menunggu dan cek e-mail anda secara berkala. Terima kasih'
              ) : !doctorInfo?.isVerified ? (
                <>
                  Akun anda sudah disetujui oleh admin. Segera lakukan
                  verifikasi e-mail agar anda dapat segera melakukan
                  telekonsultasi di ObatIn.&nbsp;
                  <u onClick={handleReverify}>Klik disini</u> bila anda belum
                  menerima e-mail verifikasi. Terima kasih
                </>
              ) : !doctorInfo?.avatarUrl || !doctorInfo?.name ? (
                'Segera lengkapi data diri agar memudahkan pasien mencari anda'
              ) : (
                'Selamat! Semua terlihat baik. Salam sehat!'
              )}
            </p>
          </ContentSubcontainer>
        </DoctorProgressContainer>
      </DashboardPageContentContainer>
    </DoctorDashboardPageContainer>
  );
};

export default DoctorDashboardPage;
