'use client';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { navigateToLogin } from '../actions';
import { useEffect, useState } from 'react';
import { DecodedJwtItf } from '@/types/jwtTypes';
import { EditProfileStateItf } from '@/types/dashboardTypes';
import {
  AddressContainer,
  DashboardPageContainer,
  DashboardPageContentContainer,
  ImgBg,
  ProfileContainer,
  ProfileContent,
  ProfileContentLeft,
  ProfileContentRight,
  ProfileContentSeparator,
  ProfileHeader,
  UserDetailDiv,
} from '@/styles/dashboard/Dashboard.styles';
import Header from '@/components/fragments/navbar/Navbar';
import CustomButton from '@/components/elements/button/CustomButton';
import PlaceholderAva from '@/assets/PlaceholderAva';
import EditPencilICO from '@/assets/dashboard/EditPencilICO';
import RegularInput from '@/components/auth/RegularInput';
import PasswordInput from '@/components/auth/PasswordInput';

const DashboardPage = (): React.ReactElement => {
  const [userRole, setUserRole] = useState<string>('');
  const [isNavbarExpanded, setisNavbarExpanded] = useState<boolean>(false);
  const [editingFields, setEditingFields] = useState<EditProfileStateItf>({
    email: false,
    name: false,
    password: false,
  });

  // const handleEditChange = (
  //   prevState: SetStateAction<EditProfileStateItf>,
  //   field: EditProfileStateItf,
  // ) => {
  //   setEditingFields((prevState) => {
  //     ...prevState,
  //     field = true
  //   });
  // };

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
    <DashboardPageContainer>
      <Header
        isOpened={isNavbarExpanded}
        toggleDrawer={() => setisNavbarExpanded(!isNavbarExpanded)}
      />

      <DashboardPageContentContainer>
        <ProfileContainer>
          <ProfileHeader>
            <h1>Profil</h1>
            <CustomButton
              content='Simpan Profil'
              $bgColor='#cbd5e0'
              $width='150px'
              $height='35px'
              $fontSize='18px'
            />
          </ProfileHeader>

          <ProfileContent>
            <ProfileContentLeft>
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

            <ProfileContentSeparator />

            <ProfileContentRight>
              <h2>E-mail</h2>
              <UserDetailDiv>
                {editingFields.email ? (
                  <>
                    <RegularInput
                      defaultValue={'useremail@gmail.com'}
                      $marBot={0}
                      validationMessage='example'
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
                    <span>placeholder@gmail.com</span>
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
                      defaultValue={'John Doe'}
                      $marBot={0}
                      validationMessage='example'
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
                    <span>John Doe</span>
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
                      defaultValue={'**********'}
                      validationMessage='example'
                      title=''
                      placeholder=''
                      $viewBox='0 0 22 22'
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
                    <span>**********</span>
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
            </ProfileContentRight>
          </ProfileContent>
        </ProfileContainer>

        <AddressContainer>ASD</AddressContainer>
      </DashboardPageContentContainer>
    </DashboardPageContainer>
  );
};

export default DashboardPage;
