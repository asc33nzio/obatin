import { SidebarContainer, TOP } from '@/styles/elements/Sidebar.styles';
import MenuItemsList from './MenuItemList';
import { MENU_ITEMS } from '@/constants/menu-items';
import React from 'react';
import { IconContainer } from '@/styles/homepage/Navbar.styles';
import { ChevronLeft } from '@styled-icons/material';
import ObatinICO from '@/assets/icons/ObatinICO';

type SidebarProps = {
  isOpened: boolean;
  toggleDrawer: () => void;
};

export default function Sidebar({
  isOpened,
  toggleDrawer,
}: SidebarProps): React.ReactElement {
  return (
    <SidebarContainer $isOpened={isOpened}>
      <TOP>
        <ObatinICO />
        <IconContainer onClick={toggleDrawer}>
          {isOpened ? <ChevronLeft /> : null}
        </IconContainer>
      </TOP>
      <MenuItemsList options={MENU_ITEMS} />
    </SidebarContainer>
  );
}
