'use client';
import {
  Cart,
  CartItemContainer,
  CartSection,
  Content,
  OrderSummary,
  SectionTitle,
} from '@/styles/pages/product/Cart.styles';
import {
  Body,
  SubmitSection,
} from '@/styles/pages/checkout/CheckoutPage.styles';
import { navigateToProductList } from '@/app/actions';
import { Container } from '@/styles/Global.styles';
import { useObatinSelector } from '@/redux/store/store';
import Navbar from '@/components/organisms/navbar/Navbar';
import LocationICO from '@/assets/icons/LocationICO';
import CustomButton from '@/components/atoms/button/CustomButton';
import CartProductCard from '@/components/atoms/cart/CartProductCard';
import AddressCard from '@/components/molecules/cards/AddressCard';
import PaymentSummaryComponent from '@/components/molecules/summary/PaymentSummary';

const CartPage = (): React.ReactElement => {
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
                  userInfo.activeAddressId === address.id && (
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
                  )
                );
              })}
            </CartItemContainer>
            <CartSection>
              <CartProductCard />
            </CartSection>
            <SubmitSection>
              <CustomButton
                content='Tambahkan Barang Lain'
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
