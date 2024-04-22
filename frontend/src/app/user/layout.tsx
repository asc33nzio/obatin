'use client';
import Navbar from '@/components/fragments/Navbar/Navbar';
import Sidebar from '@/components/fragments/sidebar/Sidebar';
import { Body } from '@/styles/Global.styles';
import { Inter } from 'next/font/google';
import { useState } from 'react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const UserPageLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpened, setOpened] = useState(false);
  const toggleDrawer = () => {
    setOpened((prev) => !prev);
  };

  return (
    <html lang='en' className={inter.className}>
      <Sidebar toggleDrawer={toggleDrawer} isOpened={isOpened} />
      <Body>
        <Navbar isOpened={isOpened} toggleDrawer={toggleDrawer} />
        <section>{children}</section>
      </Body>
    </html>
  );
};

export default UserPageLayout;
