'use client';
// import { useState } from 'react';
import { navigateToCart } from '@/app/actions';
import CustomButton from '@/components/atoms/button/CustomButton';
import RegularInput from '@/components/atoms/input/RegularInput';
import PaymentSummaryComponent from '@/components/molecules/summary/PaymentSummary';
import Navbar from '@/components/organisms/navbar/Navbar';
import { useUploadValidation } from '@/hooks/useUploadValidation';
import { Container } from '@/styles/Global.styles';
import { ImageContainer } from '@/styles/organisms/modal/modalContent/UploadPayment.styles';
import { Body } from '@/styles/pages/checkout/CheckoutPage.styles';
import {
  Cart,
  CartSection,
  Content,
  OrderSummary,
  SectionTitle,
} from '@/styles/pages/product/Cart.styles';
import Image from 'next/image';
import React from 'react';

const Checkout = () => {
  const { handlePdfChange, userUploadValidationError } = useUploadValidation();

  return (
    <Container>
      <Navbar />
      <Body>
        <Content>
          <Cart>
            <SectionTitle>Opsi Pembayaran</SectionTitle>
            <CartSection>
              <SectionTitle>
                <p>Upload Bukti Pembayaran</p>
              </SectionTitle>
              <RegularInput
                type='file'
                placeholder='Unggah file'
                validationMessage={userUploadValidationError}
                onChange={handlePdfChange}
                accept='image/*,.pdf'
                $fontSize={18}
              />
              <ImageContainer>
                <Image src='' width={300} height={300} alt='bukti' />
              </ImageContainer>
              <CustomButton
                $width='100%'
                $fontSize='16px'
                content='Proses Pembayaran'
              />
            </CartSection>
          </Cart>
          <OrderSummary>
            <PaymentSummaryComponent isNext={false} />
          </OrderSummary>
          <CustomButton
            content='Kembali'
            $fontSize='16px'
            $width='120px'
            onClick={() => navigateToCart()}
          />
        </Content>
      </Body>
    </Container>
  );
};

export default Checkout;
