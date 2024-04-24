import {
  IconContainer,
  Left,
  NavContainer,
} from '@/styles/organisms/Navbar.styles';
import { Menu, ChevronLeft } from '@styled-icons/material';
import ObatinICO from '@/assets/icons/ObatinICO';
import SearchComponent from '../../molecules/search/SearchComponent';
import CustomButton from '../../atoms/button/CustomButton';

type navbarPropsItf = {
  isOpened: boolean;
  toggleDrawer: () => void;
};

export default function Header({
  isOpened,
  toggleDrawer,
}: navbarPropsItf): React.ReactElement {
  return (
    <NavContainer>
      <Left>
        <IconContainer onClick={toggleDrawer}>
          {isOpened ? <ChevronLeft /> : <Menu />}
        </IconContainer>
        <ObatinICO />
      </Left>
      <SearchComponent />
      <CustomButton
        content='Login'
        $width='120px'
        $height='50px'
        $fontSize='16px'
      />
    </NavContainer>
  );
}
