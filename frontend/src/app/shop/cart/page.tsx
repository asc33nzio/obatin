'use client';
import Navbar from '@/components/organisms/navbar/Navbar';
import { Container } from '@/styles/Global.styles';
import {
  Cart,
  CartItemContainer,
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
import { useObatinSelector } from '@/redux/store/store';

const CartPage = () => {
  const userInfo = useObatinSelector((state) => state?.auth);
  return (
    <Container>
      <Navbar />
      <Body>
        <Content>
          <Cart>
            <SectionTitle>Keranjang Saya</SectionTitle>
            <CartItemContainer>
              <SectionTitle>
                <LocationICO />
                <p>Alamat Pengiriman</p>
              </SectionTitle>

              {userInfo?.addresses?.map((address, index) => {
                if (!address.alias) return;
                let fullAddress = address.detail;
                fullAddress += `, ${address.city.province.name}, ${address.city.type} ${address.city.name}, ${address.city.postal_code}`;
                return (
                  <AddressCard
                    $id={address.id === null ? 0 : address.id}
                    key={`userAddressCard${index}`}
                    isMainAddress={false}
                    alias={address.alias}
                    details={fullAddress}
                    $disableButtons
                    $justify='space-between'
                    $padding='20px 0'
                    $fontSize={16}
                    $borderDisable={true}
                    $height={100}
                  />
                );
              })}
            </CartItemContainer>
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
