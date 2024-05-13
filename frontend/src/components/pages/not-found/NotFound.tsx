'use client';
import BackgroundNotFound from '@/assets/error/BackgroundNotFoundICO';
import NotFoundICO from '@/assets/error/NotFoundICO';
import React from 'react';
import { navigateToHome } from '../../../app/actions';
import {
  NotFoundContainer,
  NotFoundContainerContent,
  NotFoundContent,
  NotFoundContentBackgroundImage,
  NotFoundContentButton,
  NotFoundImage,
  NotFoundLine,
} from '@/styles/pages/not-found/NotFound.styles';

function NotFoundPage() {
  return (
    <NotFoundContainer>
      <NotFoundImage>
        <NotFoundICO />
      </NotFoundImage>

      <NotFoundLine></NotFoundLine>
      <NotFoundContainerContent>
        <NotFoundContent fontSize='112px' fontWeight='700'>
          404
        </NotFoundContent>
        <NotFoundContent fontSize='36px' fontWeight='500'>
          Halaman tidak dapat ditemukan
        </NotFoundContent>
        <NotFoundContent fontSize='24px' fontWeight='400'>
          Kamu dapat bersantai disini atau kembali ke beranda
        </NotFoundContent>

        <NotFoundContentButton
          onClick={(e) => {
            navigateToHome();
            e.preventDefault();
          }}
        >
          Ke Beranda
        </NotFoundContentButton>
      </NotFoundContainerContent>
      <NotFoundContentBackgroundImage>
        <BackgroundNotFound />
      </NotFoundContentBackgroundImage>
    </NotFoundContainer>
  );
}

export default NotFoundPage;
