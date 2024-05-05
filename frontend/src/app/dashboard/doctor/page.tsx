'use client';
import '@/styles/pages/dashboard/datePicker.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
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
} from '@/styles/pages/dashboard/Dashboard.styles';
import { EditProfileDoctorStateItf } from '@/types/dashboardTypes';
import { useState } from 'react';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useUploadValidation } from '@/hooks/useUploadValidation';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { debounce } from '@/utils/debounce';
import { getCookie } from 'cookies-next';
import { setAuthDoctorState } from '@/redux/reducers/authDoctorSlice';
import { BounceLoader } from 'react-spinners';
import Navbar from '@/components/organisms/navbar/Navbar';
import CustomButton from '@/components/atoms/button/CustomButton';
import EditPencilICO from '@/assets/dashboard/EditPencilICO';
import RegularInput from '@/components/atoms/input/RegularInput';
import PasswordInput from '@/components/atoms/input/PasswordInput';
import Axios from 'axios';
import Image from 'next/image';
import DefaultDoctorAvatar from '@/assets/DefaultDoctorAvatar.svg';
import ProgressBar from '@/components/atoms/progressBar/ProgressBar';

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
    });
  const [hasNewValue, setHasNewValue] = useState<EditProfileDoctorStateItf>({
    email: false,
    name: false,
    password: false,
    confirmPassword: false,
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isInitialPassCheckLoading, setIsInitialPassCheckLoading] =
    useState<boolean>(false);

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

  const handleUpdateDcotorProfile = async () => {
    setIsLoading(true);

    if (!doctorInfo?.isVerified) {
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
          default:
            break;
        }
      }
    });

    try {
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
          aid: udpatedDoctorData.aid,
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
    });

    setHasNewValue({
      email: false,
      name: false,
      password: false,
      confirmPassword: false,
      avatar: false,
    });
  };

  return (
    <DoctorDashboardPageContainer $isDesktopDisplay={isDesktopDisplay}>
      <Navbar />

      <DashboardPageContentContainer>
        <DoctorProfileContainer $isDesktopDisplay={isDesktopDisplay}>
          <ProfileHeader $isDesktopDisplay={isDesktopDisplay}>
            <h1>Profil</h1>

            <ProfileHeaderButtonsDiv>
              <CustomButton
                content='Sejarah Transaksi'
                $bgColor='#00B5C0'
                $width='150px'
                $height='40px'
                $fontSize='18px'
              />
              <CustomButton
                content='Simpan Profil'
                $width='150px'
                $height='40px'
                $fontSize='18px'
                disabled={!Object.values(hasNewValue).some((value) => value)}
                onClick={handleUpdateDcotorProfile}
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
              ) : !doctorInfo?.avatarUrl ? (
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
