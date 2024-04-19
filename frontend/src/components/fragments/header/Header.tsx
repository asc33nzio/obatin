import React from 'react'
import { IconContainer, Left, NavContainer } from '@/styles/homepage/Header.styles'
import Image from 'next/image'
import ObatinICO from '@/assets/icons/ObatinICO'
import SearchComponent from '../../elements/search/SearchComponent'
import CustomButton from '../../elements/button/CustomButton'
import { Menu, ChevronLeft } from "@styled-icons/material";

type HeaderProps = {
  isOpened: boolean,
  toggleDrawer: () => void,
};

export default function Header({ isOpened, toggleDrawer }: HeaderProps) {
  return (
    <NavContainer>
        <Left>
          <IconContainer onClick={toggleDrawer}>
            {isOpened ? <ChevronLeft /> : <Menu />}
          </IconContainer>
          <ObatinICO/>
        </Left>
        <SearchComponent/>
        <CustomButton width='120px' height='50px' content='Login' fontSize='16px'/>
    </NavContainer>
  )
}

