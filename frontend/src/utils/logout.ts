import { deleteCookie } from 'cookies-next';

const logout = () => {
  localStorage.clear();
  deleteCookie('access_token');
  deleteCookie('refresh_token');
};

export default logout;
