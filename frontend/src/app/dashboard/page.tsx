'use client';
import styles from '@/styles/Auth.module.css';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { navigateToLogin } from '../actions';
import { useEffect, useState } from 'react';
import { DecodedJwtItf } from '@/types/jwtTypes';
import { DashboardPageContainer } from '@/styles/dashboard/Dashboard.styles';
import Header from '@/components/fragments/header/Header';

const DashboardPage = (): React.ReactElement => {
  const [userRole, setUserRole] = useState<string>('');
  const [isNavbarExpanded, setisNavbarExpanded] = useState<boolean>(false);

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
    </DashboardPageContainer>
  );
};

export default DashboardPage;
