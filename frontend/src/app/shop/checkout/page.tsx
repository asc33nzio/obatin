'use client';
import Navbar from '@/components/organisms/navbar/Navbar';
import { Container } from '@/styles/Global.styles';
import { Content } from '@/styles/pages/product/Cart.styles';
import React from 'react';

const Checkout = () => {
  return (
    <Container>
      <Navbar />
      <Content></Content>
    </Container>
  );
};

export default Checkout;
