'use client';
import { Body } from '@/styles/Global.styles';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import Navbar from '@/components/organisms/navbar/Navbar';
import Sidebar from '@/components/organisms/sidebar/Sidebar';

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
