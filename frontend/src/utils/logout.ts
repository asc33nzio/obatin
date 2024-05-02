import { deleteCookie } from 'cookies-next';

const logout = () => {
  sessionStorage.removeItem('auth');
  deleteCookie('access_token');
  deleteCookie('refresh_token');
};

export default logout;
