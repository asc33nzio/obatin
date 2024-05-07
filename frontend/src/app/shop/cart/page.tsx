'use client';
import Navbar from '@/components/organisms/navbar/Navbar';
import { Container } from '@/styles/Global.styles';
import {
  Cart,
  CartSection,
  Content,
  OrderSummary,
  SectionTitle,
} from '@/styles/pages/product/Cart.styles';
import React from 'react';
import {
  Body,
  SubmitSection,
} from '@/styles/pages/checkout/CheckoutPage.styles';
import CustomButton from '@/components/atoms/button/CustomButton';
import { navigateToProductList } from '@/app/actions';
import ProductCartItem from '@/components/atoms/cart/ProductCartItem';
import AddressCard from '@/components/molecules/cards/AddressCard';
import PaymentSummaryComponent from '@/components/molecules/summary/PaymentSummary';
import LocationICO from '@/assets/icons/LocationICO';

const CartPage = () => {
  return (
    <Container>
      <Navbar />
      <Body>
        <Content>
          <Cart>
            <SectionTitle>Keranjang Saya</SectionTitle>
            <CartSection>
              <SectionTitle>
                <LocationICO />
                <p>Alamat Pengiriman</p>
              </SectionTitle>
              <AddressCard
                $id={1}
                isMainAddress={false}
                alias='8GVH+9Q3, Sirnabaya, Kecamatan Gunungjati, Jawa Barat, Indonesia, 45151'
                details=''
                disableButtons={true}
              />
            </CartSection>
            <CartSection>
              <ProductCartItem />
            </CartSection>
            <SubmitSection>
              <CustomButton
                content='Tambah ke keranjang'
                $width='300px'
                $fontSize='16px'
                onClick={() => navigateToProductList()}
              />
            </SubmitSection>
          </Cart>
          <OrderSummary>
            <PaymentSummaryComponent isNext />
          </OrderSummary>
        </Content>
      </Body>
    </Container>
  );
};

export default CartPage;
