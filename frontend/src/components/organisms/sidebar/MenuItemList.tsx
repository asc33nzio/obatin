import { MenuItem as MenuItemType } from '@/constants/menu-items';
import { deleteCookie } from 'cookies-next';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { resetAuthState } from '@/redux/reducers/authSlice';
import { navigateToLogin } from '@/app/actions';
import { resetAuthDoctorState } from '@/redux/reducers/authDoctorSlice';
import MenuItem from './MenuItem';

type MenuItemsListProps = {
  options: MenuItemType[];
};

export default function MenuItemsList({
  options,
}: MenuItemsListProps): React.ReactElement {
  const dispatch = useObatinDispatch();
  const userInfo = useObatinSelector((state) => state?.auth);
  const doctorInfo = useObatinSelector((state) => state?.authDoctor);
  const isLoggedIn = userInfo?.aid || doctorInfo?.aid;

  const handleLogout = () => {
    localStorage.clear();
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    dispatch(resetAuthState());
    dispatch(resetAuthDoctorState());
    navigateToLogin();
  };

  return (
    <>
      {options.map((option) => {
        if (option.name === 'Logout') {
          if (!isLoggedIn) return null;

          return (
            <MenuItem
              key={option.id}
              menuItem={option}
              handler={handleLogout}
            />
          );
        }

        return (
          <MenuItem menuItem={option} key={option.id} handler={undefined} />
        );
      })}
    </>
  );
}
