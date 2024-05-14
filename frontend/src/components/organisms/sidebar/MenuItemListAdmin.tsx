import { MenuItem as MenuItemType } from '@/constants/menu-items';
import { deleteCookie, getCookie } from 'cookies-next';
import { navigateToLogin } from '@/app/actions';
import MenuItem from './MenuItem';

type MenuItemsListProps = {
  options: MenuItemType[];
};

export default function MenuItemsListAdmin({
  options,
}: MenuItemsListProps): React.ReactElement {
  const accessToken = getCookie('access_token');

  const handleLogout = () => {
    localStorage.clear();
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    navigateToLogin();
  };

  return (
    <>
      {options.map((option) => {
        if (option.name === 'Keluar') {
          if (!accessToken) return null;

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
