'use client';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  Cart,
  CartSection,
  CheckoutPageSubcontainer,
  OrderSummary,
  SectionTitle,
} from '@/styles/pages/product/Cart.styles';
import {
  ImageContainer,
  PdfContainer,
} from '@/styles/organisms/modal/modalContent/UploadPayment.styles';
import {
  navigateToCart,
  navigateToHome,
  navigateToProductList,
  navigateToTxHistory,
} from '@/app/actions';
import { ChangeEvent, useEffect, useState } from 'react';
import { Container } from '@/styles/Global.styles';
import { Body } from '@/styles/pages/checkout/CheckoutPage.styles';
import { getCookie } from 'cookies-next';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useUploadValidation } from '@/hooks/useUploadValidation';
import { Document, Page, pdfjs } from 'react-pdf';
import { usePathname } from 'next/navigation';
import { decrypt } from '@/utils/crypto';
import { PropagateLoader } from 'react-spinners';
import { LoaderDiv } from '@/styles/pages/auth/Auth.styles';
import Axios from 'axios';
import Navbar from '@/components/organisms/navbar/Navbar';
import RegularInput from '@/components/atoms/input/RegularInput';
import CustomButton from '@/components/atoms/button/CustomButton';
import Image from 'next/image';
import PaymentSummaryUploadPayment from '@/components/molecules/summary/PaymentSummaryUploadPayment';

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
  const pathname = usePathname();
  const cipherPID = pathname.split('/').pop();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [plaintextPID, setPlaintextPID] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setIsLoading(true);
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

      setToast({
        showToast: true,
        toastMessage: 'Pembayaran kamu sedang kami proses',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });

      await Axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/${plaintextPID}`,
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

      navigateToTxHistory();
    } catch (error: any) {
      console.error(error);
      if (error.response.request.status === 404) {
        setToast({
          showToast: true,
          toastMessage: 'Transaksi yang anda cari tidak ditemukan',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        navigateToProductList();
        return;
      }

      setToast({
        showToast: true,
        toastMessage: 'Maaf, gagal mengunggah bukti pembayaran',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const validatePID = async () => {
      try {
        if (cipherPID === undefined) throw new Error('invalid path');
        const decodedPID = decodeURIComponent(cipherPID);
        console.log(decodedPID);

        const decryptedPID = await decrypt(decodedPID);
        setPlaintextPID(decryptedPID);
      } catch (_e: any) {
        console.error('this transaction does not exist');
        setToast({
          showToast: true,
          toastMessage: 'Transaksi yang anda cari tidak ditemukan',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        navigateToHome();
      }
    };

    validatePID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cipherPID]);

  return (
    <Container>
      <Navbar />
      <Body>
        <CheckoutPageSubcontainer>
          <Cart>
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

              {isLoading ? (
                <LoaderDiv>
                  <PropagateLoader
                    color='#dd1b50'
                    speedMultiplier={0.8}
                    size={'18px'}
                    cssOverride={{
                      alignSelf: 'center',
                      justifySelf: 'center',
                    }}
                  />
                </LoaderDiv>
              ) : (
                <CustomButton
                  $width='100%'
                  $height='75px'
                  $fontSize='16px'
                  content='Lanjutkan Pembayaran'
                  onClick={handleCheckout}
                  disabled={isLoading ? true : false}
                />
              )}
            </CartSection>
          </Cart>
          <OrderSummary>
            <PaymentSummaryUploadPayment />
          </OrderSummary>
          <CustomButton
            content='Kembali'
            $fontSize='16px'
            $width='120px'
            $bgColor='#de161c'
            onClick={() => navigateToCart()}
          />
        </CheckoutPageSubcontainer>
      </Body>
    </Container>
  );
};

export default Checkout;
