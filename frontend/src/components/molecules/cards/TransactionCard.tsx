'use client';
import 'react-loading-skeleton/dist/skeleton.css';
import 'moment/locale/id';
import {
  BottomContentContainer,
  BreakdownCenterDiv,
  BreakdownRightDiv,
  DeliveryStatusBadge,
  FillerDiv,
  SeeMoreDiv,
  SeparatorDiv,
  SkeletonDiv,
  TransactionCardContainer,
  TxCardPharmacyName,
  TxHeaders,
  TxProductBreakdown,
} from '@/styles/molecules/cards/TransactionCard.styles';
import { TxItf } from '@/types/transactionTypes';
import { useRouter } from 'next/navigation';
import { encrypt } from '@/utils/crypto';
import React, { useState } from 'react';
import DetailICO from '@/assets/icons/DetailICO';
import Image from 'next/image';
import DotICO from '@/assets/icons/DotICO';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import CustomButton from '@/components/atoms/button/CustomButton';
import InvokableModal from '@/components/organisms/modal/InvokableModal';
moment.locale('id');

const TransactionCard = (props: TxItf): React.ReactElement => {
  const router = useRouter();
  const splittedDate = props?.created_at?.split(' ')?.[0];
  const orderTime = props?.created_at?.split(' ')?.[1];
  const formattedDate = moment(splittedDate, 'DD-MM-YYYY').format(
    'dddd, Do MMMM YYYY',
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const deliveryStatusMap = {
    waiting_payment: 'MENUNGGU PEMBAYARAN',
    waiting_confirmation: 'MENUNGGU KONFIRMASI',
    processed: 'DIPROSES',
    sent: 'DIKIRIM',
    confirmed: 'DITERIMA',
    cancelled: 'DIBATALKAN',
  };

  const deliveryStatusColorMap = {
    waiting_payment: '#BD2680',
    waiting_confirmation: '#E7CE50',
    processed: '#00C5C0',
    sent: '#5F5D98',
    confirmed: '#14F500',
    cancelled: '#DE161C',
  };

  const handleUploadPayment = async () => {
    const encryptedPID = await encrypt(props?.payment_id?.toString());
    const encodedEncryptedPID = encodeURIComponent(encryptedPID);
    router.replace(`/shop/checkout/${encodedEncryptedPID}`);
  };

  return (
    <React.Fragment>
      <TransactionCardContainer>
        <TxHeaders>
          <TxCardPharmacyName>
            <DetailICO onClick={() => setIsModalOpen(true)} />

            {props.isLoading ? (
              <SkeletonDiv>
                <Skeleton
                  count={1}
                  direction='ltr'
                  enableAnimation={true}
                  baseColor='#ffffff'
                  highlightColor='#00b5c0'
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              </SkeletonDiv>
            ) : (
              <DeliveryStatusBadge
                $color={deliveryStatusColorMap[props?.status]}
              >
                <h1>{deliveryStatusMap[props?.status]}</h1>
              </DeliveryStatusBadge>
            )}
          </TxCardPharmacyName>

          <h2>
            {props.isLoading ? (
              <SkeletonDiv>
                <Skeleton
                  count={1}
                  direction='ltr'
                  enableAnimation={true}
                  baseColor='#ffffff'
                  highlightColor='#00b5c0'
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '200px',
                  }}
                />
              </SkeletonDiv>
            ) : (
              <>
                {formattedDate} {orderTime}
              </>
            )}
          </h2>
          {props.isLoading ? (
            <SkeletonDiv>
              <Skeleton
                count={1}
                direction='ltr'
                enableAnimation={true}
                baseColor='#ffffff'
                highlightColor='#00b5c0'
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '400px',
                  marginLeft: '675px',
                }}
              />
            </SkeletonDiv>
          ) : (
            <h3>{props.invoice_number}</h3>
          )}
        </TxHeaders>

        {props?.cart_items?.map((product, index) => {
          if (index > 1) return null;
          return (
            <React.Fragment
              key={`txProductCard${product.pharmacy_product_id}_${index}`}
            >
              <TxProductBreakdown $isLoading={props.isLoading}>
                {props.isLoading ? (
                  <SkeletonDiv $width='100px'>
                    <Skeleton
                      count={1}
                      direction='ltr'
                      enableAnimation={true}
                      baseColor='#ffffff'
                      highlightColor='#00b5c0'
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '75px',
                        height: '40px',
                        marginTop: '10px',
                        marginLeft: '10px',
                      }}
                    />
                  </SkeletonDiv>
                ) : (
                  <Image
                    src={product.thumbnail_url}
                    alt={`txProductIMG${index}`}
                    width={250}
                    height={250}
                    onClick={() => router.replace(`/products/${product.slug}`)}
                  />
                )}

                {props.isLoading ? (
                  <SkeletonDiv $width='80%'>
                    <Skeleton
                      count={1}
                      direction='ltr'
                      enableAnimation={true}
                      baseColor='#ffffff'
                      highlightColor='#00b5c0'
                      style={{
                        position: 'absolute',
                        top: 5,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '18px',
                        width: '300px',
                      }}
                    />
                    <Skeleton
                      count={1}
                      direction='ltr'
                      enableAnimation={true}
                      baseColor='#ffffff'
                      highlightColor='#00b5c0'
                      style={{
                        position: 'absolute',
                        top: 25,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '12.5px',
                        width: '300px',
                      }}
                    />
                    <Skeleton
                      count={1}
                      direction='ltr'
                      enableAnimation={true}
                      baseColor='#ffffff'
                      highlightColor='#00b5c0'
                      style={{
                        position: 'absolute',
                        top: 40,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '12.5px',
                        width: '300px',
                      }}
                    />
                  </SkeletonDiv>
                ) : (
                  <BreakdownCenterDiv>
                    <h1>
                      {product.name.charAt(0).toUpperCase()}
                      {product.name.slice(1, product.name.length - 1)}
                    </h1>
                    <span>
                      {product.quantity} unit x Rp.&nbsp;
                      {product.price.toLocaleString('id-ID')}{' '}
                      {product.selling_unit}
                    </span>
                    <span>
                      {product.weight > 1000
                        ? `${product.weight / 1000} kg`
                        : `${product.weight} g`}
                      &nbsp;
                      {product.selling_unit}
                    </span>
                  </BreakdownCenterDiv>
                )}

                {index === 0 && !props.isLoading ? (
                  <>
                    <SeparatorDiv />
                    <BreakdownRightDiv>
                      Total Belanja
                      <span>Rp. {props.subtotal.toLocaleString('id-ID')}</span>
                    </BreakdownRightDiv>
                  </>
                ) : index === 0 && props.isLoading ? (
                  <SkeletonDiv $width='250px'>
                    <Skeleton
                      count={1}
                      direction='ltr'
                      enableAnimation={true}
                      baseColor='#ffffff'
                      highlightColor='#00b5c0'
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '225px',
                        height: '35px',
                      }}
                    />
                  </SkeletonDiv>
                ) : null}
              </TxProductBreakdown>

              {props?.cart_items?.length === 1 && (
                <FillerDiv
                  key={`txProductCardFiller${product.pharmacy_product_id}_${index}`}
                />
              )}
            </React.Fragment>
          );
        })}

        <BottomContentContainer
          $hasMultiple={
            props?.status === 'waiting_payment' || props?.status === 'sent'
          }
        >
          {props?.status === 'waiting_payment' && !props?.isLoading && (
            <CustomButton
              content='Selesaikan Pembayaran'
              $bgColor='#00B5C0'
              $width='200px'
              $height='25px'
              $fontSize='14px'
              onClick={() => handleUploadPayment()}
            />
          )}

          {props?.status === 'sent' && !props?.isLoading && (
            <CustomButton
              content='Selesaikan Pesanan'
              $bgColor='#00B5C0'
              $width='200px'
              $height='25px'
              $fontSize='14px'
              onClick={() => props?.handleConfirmOrder(props?.order_id)}
            />
          )}

          {!props?.isLoading && (
            <SeeMoreDiv onClick={props.handleOpenViewMore}>
              {props?.cart_items?.length <= 2 ? (
                <h4>Lihat Detail Transaksi</h4>
              ) : (
                <h4>Lihat {props?.cart_items?.length - 2} produk lainnya</h4>
              )}
              <DotICO />
            </SeeMoreDiv>
          )}
        </BottomContentContainer>
      </TransactionCardContainer>
      <InvokableModal
        $pharmacyDetail={{
          id: props?.pharmacy?.id,
          name: props?.pharmacy?.name,
          address: props?.pharmacy?.address,
          distance: props?.pharmacy?.distance ?? 0,
          pharmacist_name: props?.pharmacy?.pharmacist_name,
          pharmacist_phone: props?.pharmacy?.pharmacist_phone,
          pharmacist_license: props?.pharmacy?.pharmacist_license,
          operational_days: props?.pharmacy?.operational_days ?? [],
          opening_time: props?.pharmacy?.opening_time,
          closing_time: props?.pharmacy?.closing_time,
        }}
        modalType='pharmacy-detail'
        $isOpen={isModalOpen}
        $onOpen={() => setIsModalOpen(true)}
        $onClose={() => setIsModalOpen(false)}
      />
    </React.Fragment>
  );
};

export default TransactionCard;
