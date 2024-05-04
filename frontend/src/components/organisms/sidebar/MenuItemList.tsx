import { MenuItem as MenuItemType } from '@/constants/menu-items';
import { deleteCookie } from 'cookies-next';
import { useObatinDispatch } from '@/redux/store/store';
import { resetAuthState } from '@/redux/reducers/authSlice';
import MenuItem from './MenuItem';
import { navigateToLogin } from '@/app/actions';
import { resetAuthDoctorState } from '@/redux/reducers/authDoctorSlice';

type MenuItemsListProps = {
  options: MenuItemType[];
};

export default function MenuItemsList({
  options,
}: MenuItemsListProps): React.ReactElement {
  const dispatch = useObatinDispatch();

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
      {options.map((option, index) => {
        if (options.length - 1 === index) {
          return (
            <MenuItem
              menuItem={option}
              key={option.id}
              handler={handleLogout}
            />
          );
        } else {
          return (
            <MenuItem menuItem={option} key={option.id} handler={undefined} />
          );
        }
      })}
    </>
  );
}
