'use client';
import Navbar from '@/components/organisms/navbar/Navbar';
import { Container } from '@/styles/Global.styles';
import {
  AddressContainer,
  ButtonAddContainer,
  CartSection,
  Content,
  Details,
  Left,
  OrderSummary,
  PaymentSummary,
  ProductItem,
  SectionTitle,
  Summary,
} from '@/styles/pages/product/Cart.styles';
import toko from '@/assets/homepage/Pharmacist-pana 1.svg';
import Image from 'next/image';
import React from 'react';
import CustomButton from '@/components/atoms/button/CustomButton';

const CartPage = () => {
  return (
    <Container>
      <Navbar />
      <Content>
        <CartSection>
          <SectionTitle>Daftar Pesanan</SectionTitle>
          <ProductItem>
            <Left>
              <Image alt='image' src={toko} width={100} height={100} />
              <Details>
                <h1>Paracetamol Kaplet 500mg</h1>
                <p>Per Box</p>
                <p>Stok: 500</p>
              </Details>
            </Left>
            <ButtonAddContainer>
              <CustomButton
                content='-'
                $width='40px'
                $height='40px'
                $border='#00B5C0'
              />
              <p>1</p>
              <CustomButton
                content='+'
                $width='40px'
                $height='40px'
                $border='#00B5C0'
              />
            </ButtonAddContainer>
          </ProductItem>
        </CartSection>
        <OrderSummary>
          <SectionTitle>Alamat</SectionTitle>
          <AddressContainer>
            <div>
              <h2>Sopo Del Tower</h2>
              <h3>
                Jl. Setia Budi Selatan No.10, RT.10/RW.7, Kuningan, Kar...
              </h3>
            </div>
            <a>Ubah</a>
          </AddressContainer>
          <SectionTitle>Ringkasan Pembayaran</SectionTitle>
          <PaymentSummary>
            <div>
              <p>Keranjang (4 items)</p>
              <p>Keranjang (4 items)</p>
            </div>
            <div>
              <p>Biaya Pengiriman</p>
              <p>Biaya Pengiriman</p>
            </div>
            <div>
              <p>Biaya Aplikasi</p>
              <p>Biaya Aplikasi</p>
            </div>
          </PaymentSummary>
          <Summary>
            <div>
              <h3>Total Belanja</h3>
              <p>Rp 1.0813.420</p>
            </div>
            <div>
              <div></div>
              <CustomButton
                content='Pembayaran'
                $width='150px'
                $height='50px'
                $fontSize='16px'
              />
            </div>
          </Summary>
        </OrderSummary>
      </Content>
    </Container>
  );
};

export default CartPage;
