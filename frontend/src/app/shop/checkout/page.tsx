'use client';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  Cart,
  CartSection,
  Content,
  OrderSummary,
  SectionTitle,
} from '@/styles/pages/product/Cart.styles';
import { ChangeEvent } from 'react';
import { Container } from '@/styles/Global.styles';
import { Body } from '@/styles/pages/checkout/CheckoutPage.styles';
import {
  ImageContainer,
  PdfContainer,
} from '@/styles/organisms/modal/modalContent/UploadPayment.styles';
import { getCookie } from 'cookies-next';
import { navigateToCart, navigateToTxHistory } from '@/app/actions';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useUploadValidation } from '@/hooks/useUploadValidation';
import { Document, Page, pdfjs } from 'react-pdf';
import { resetPharmacyStates } from '@/redux/reducers/pharmacySlice';
import { clearCart } from '@/redux/reducers/cartSlice';
import Axios from 'axios';
import Navbar from '@/components/organisms/navbar/Navbar';
import PaymentSummaryComponent from '@/components/molecules/summary/PaymentSummary';
import RegularInput from '@/components/atoms/input/RegularInput';
import CustomButton from '@/components/atoms/button/CustomButton';
import Image from 'next/image';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const Checkout = (): React.ReactElement => {
  const {
    userUpload,
    handleImageChange,
    handlePdfChange,
    userUploadValidationError,
  } = useUploadValidation();
  const accessToken = getCookie('access_token');
  const paymentId = useObatinSelector((state) => state.pharmacy.paymentId);
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const dispatch = useObatinDispatch();

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const uploadedFile = e.target.files[0];
    if (uploadedFile.type === 'application/pdf') {
      handlePdfChange(e);
      return;
    }

    handleImageChange(e);
  };

  const handleCheckout = async () => {
    try {
      if (userUpload === undefined) {
        setToast({
          showToast: true,
          toastMessage: 'Mohon untuk mengunggah file terlebih dahulu',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', userUpload);

      await Axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/${paymentId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setToast({
        showToast: true,
        toastMessage:
          'Pesanan kamu akan diproses paling lambat dalam 2 x 24 jam',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      dispatch(clearCart());
      dispatch(resetPharmacyStates());
      navigateToTxHistory();
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, gagal mengunggah bukti pembayaran',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

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
                placeholder='Unggah Pembayaran'
                onChange={handleUpload}
                validationMessage={userUploadValidationError}
                accept='image/*,.pdf'
                $fontSize={18}
                $isSet={userUpload !== undefined}
              />

              <ImageContainer>
                {userUpload && userUpload.type === 'application/pdf' ? (
                  <PdfContainer>
                    <Document file={userUpload} loading={<div>Loading...</div>}>
                      <Page pageNumber={1} width={300} height={300} />
                    </Document>
                  </PdfContainer>
                ) : userUpload ? (
                  <Image
                    src={URL.createObjectURL(userUpload)}
                    alt='bukti-pembayaran'
                    width={600}
                    height={500}
                  />
                ) : null}
              </ImageContainer>

              <CustomButton
                $width='100%'
                $fontSize='16px'
                content='Proses Pembayaran'
                onClick={handleCheckout}
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
