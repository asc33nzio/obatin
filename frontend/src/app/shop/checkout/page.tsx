'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Container } from '@/styles/Global.styles';
import { Body } from '@/styles/pages/checkout/CheckoutPage.styles';
import {
  Cart,
  CartSection,
  Content,
  OrderSummary,
  SectionTitle,
} from '@/styles/pages/product/Cart.styles';
import { ImageContainer } from '@/styles/organisms/modal/modalContent/UploadPayment.styles';
import Navbar from '@/components/organisms/navbar/Navbar';
import PaymentSummaryComponent from '@/components/molecules/summary/PaymentSummary';
import RegularInput from '@/components/atoms/input/RegularInput';
import CustomButton from '@/components/atoms/button/CustomButton';
import { getCookie } from 'cookies-next';
import { navigateToCart } from '@/app/actions';
import { useObatinSelector } from '@/redux/store/store';
import Image from 'next/image';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { setPharmacies } from '@/redux/reducers/pharmacySlice';

const Checkout = () => {
  const [selectedFile, setSelectedFile] = useState();
  const accessToken = getCookie('access_token');
  const paymentId = useObatinSelector((state) => state.pharmacy.paymentId);

  console.log('paymentid:', paymentId);

  const [setImageSrc] = useState<string>();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();

  const handlePdfChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadPaymentProof = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/${paymentId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const { data } = response;
      if (data && data.url) {
        setImageSrc(data.url);
      }
      setToast({
        showToast: true,
        toastMessage: 'Berhasil Upload',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      navigateToCart();
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, upload payment gagal',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  // const confirmPayment = async () => {
  //   try {
  //     await axios.post(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/confirmation`,
  //       {
  //         paymentId:
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     );
  //     console.log('payment success');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
                onChange={handlePdfChange}
                validationMessage='masukkan gambar atau pdf'
                accept='image/*,.pdf'
                $fontSize={18}
              />
              <ImageContainer>
                {selectedFile && (
                  <Image
                    src={URL.createObjectURL(selectedFile)}
                    alt='bukti'
                    width={600}
                    height={500}
                  />
                )}
              </ImageContainer>
              <CustomButton
                $width='100%'
                $fontSize='16px'
                content='Proses Pembayaran'
                onClick={uploadPaymentProof}
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
