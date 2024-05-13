import { DialogModal } from '@/components/organisms/modal/dialogModal/DialogModal';
import { determineOrderStatus } from '@/components/organisms/table/AdminOrderTable';
import { useToast } from '@/hooks/useToast';
import AO from '@/styles/pages/admin/AdminOrders.styles';
import { TxItf } from '@/types/transactionTypes';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const DetailCardContainer = styled.div`
  background-color: white;
  width: fit-content;
  max-width: 1000px;
  height: 700px;
  padding: 2rem;
  border-radius: 2rem;
`;

const PharmacyDetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1rem;
  border: 1px solid grey;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

const MiddleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  gap: 1rem;
  align-items: start;
`;

const PrimaryText = styled.p`
  font-size: 16px;
  font-weight: 600;
`;

const SecondaryText = styled.p`
  font-weight: 14px;
  color: #212121;
`;

const PaymentProofContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid grey;
  width: 100%;
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid grey;
  margin-top: 8px;
`;

const ProductListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 150px;
  overflow-y: auto;
`;

const ProductCard = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid grey;
`;

const ProductSubSection = styled.div<{ $width?: string }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: ${(props) => props.$width || 'fit-content'};
`;

const CustomSelect = styled.select`
  padding: 0.2rem 0.5rem;
  font-size: 14px;
`;

const CustomButton = styled.button`
  font-size: 14px;
  padding: 0.2rem 0.5rem;
`;

const AdminOrderCard = (props: TxItf): React.ReactElement => {
  const [status, setStatus] = useState<string>(props.status);
  const [editStatus, setEditStatus] = useState<boolean>(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState<boolean>(false);
  const accessToken = getCookie('access_token');
  const { setToast } = useToast();

  const handleConfirm = async (orderId: number) => {
    try {
      const _ = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/orders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf terjadi kesalahan',
        toastType: 'error',
        resolution: 'desktop',
        orientation: 'center',
      });
    }
  };

  useEffect(() => {
    setStatus(props.status);
    setEditStatus(false);
  }, [props]);

  return (
    <DetailCardContainer>
      <Title>{props?.invoice_number}</Title>
      <MiddleContainer>
        <PharmacyDetailsSection>
          <Title>Detail Apotek</Title>
          <div>
            <PrimaryText>Nama</PrimaryText>
            <SecondaryText>{props?.pharmacy?.name}</SecondaryText>
          </div>
          <div>
            <PrimaryText>Alamat</PrimaryText>
            <SecondaryText>{props?.pharmacy?.address}</SecondaryText>
          </div>
          <div>
            <PrimaryText>Waktu Operasional</PrimaryText>
            <SecondaryText>
              {props?.pharmacy?.opening_time} - {props?.pharmacy?.closing_time}
            </SecondaryText>
          </div>
          <div>
            <PrimaryText>Nama Apoteker</PrimaryText>
            <SecondaryText>{props?.pharmacy?.pharmacist_name}</SecondaryText>
          </div>
          <div>
            <PrimaryText>Kontak</PrimaryText>
            <a
              href={`https://wa.me/${props?.pharmacy?.pharmacist_phone.replace('0', '62')}`}
            >
              {props?.pharmacy?.pharmacist_phone}
            </a>
          </div>
        </PharmacyDetailsSection>
        <PaymentProofContainer>
          <div>
            <PrimaryText>Nama Kustomer</PrimaryText>
            <SecondaryText>{props?.user_name}</SecondaryText>
          </div>
          <div>
            <PrimaryText>Tanggal Pesan</PrimaryText>
            <SecondaryText>{props?.created_at}</SecondaryText>
          </div>
          <div>
            <PrimaryText>Subtotal</PrimaryText>
            <SecondaryText>
              Rp. {props.subtotal?.toLocaleString()}
            </SecondaryText>
          </div>
          <div>
            <PrimaryText>Bukti Pembayaran</PrimaryText>
            <SecondaryText>
              {props?.status !== 'waiting_payment' ? (
                <a
                  href={props?.payment_proof_url || ''}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Klik Di sini untuk melihat
                </a>
              ) : (
                'Belum ada pembayaran'
              )}
            </SecondaryText>
          </div>
          <div>
            <PrimaryText>Status</PrimaryText>
            {!editStatus ? (
              <SecondaryText>
                {determineOrderStatus(status || '')}{' '}
                {(props.status === 'sent' || props.status === 'processed') && (
                  <span>
                    <CustomButton onClick={() => setEditStatus(true)}>
                      Ubah Status
                    </CustomButton>
                  </span>
                )}
              </SecondaryText>
            ) : (
              <span>
                <CustomSelect
                  onChange={(e) => setStatus(e.target.value)}
                  defaultValue={determineOrderStatus(props.status)}
                >
                  {props.status === 'processed' && (
                    <option value='processed'>Diproses</option>
                  )}
                  {(props.status === 'sent' ||
                    props.status === 'processed') && (
                    <option value='sent'>Dikirim</option>
                  )}
                  <option value='confirmed'>Diterima</option>
                  {props.status !== 'sent' && props.status !== 'confirmed' && (
                    <option value='cancelled'>Dibatalkan</option>
                  )}
                </CustomSelect>
                <CustomButton
                  onClick={() => {
                    setEditStatus(false);
                    setIsModalConfirmOpen(true);
                  }}
                >
                  Konfirmasi
                </CustomButton>
              </span>
            )}
          </div>
        </PaymentProofContainer>
      </MiddleContainer>
      <ProductList>
        <Title>Detail Produk</Title>
        <ProductListContainer>
          {props?.cart_items?.map((item, index) => (
            <ProductCard key={index}>
              <Image
                width={50}
                height={50}
                src={item?.thumbnail_url}
                alt={item?.name}
              />
              <ProductSubSection>
                <SecondaryText>{item?.name}</SecondaryText>
                <SecondaryText>{item?.selling_unit}</SecondaryText>
              </ProductSubSection>
              <ProductSubSection>
                <SecondaryText>
                  {item?.weight?.toLocaleString()} gram
                </SecondaryText>
                <SecondaryText>
                  Rp. {item?.price?.toLocaleString()}
                </SecondaryText>
              </ProductSubSection>
              <ProductSubSection>
                <Title>x {item?.quantity}</Title>
              </ProductSubSection>
            </ProductCard>
          ))}
        </ProductListContainer>
      </ProductList>
      <DialogModal
        isOpen={isModalConfirmOpen}
        hasCloseBtn
        onClose={() => setIsModalConfirmOpen(false)}
      >
        <AO.ModalConfirmationContainer>
          <AO.TitleText>
            Apakah anda yakin akan memperbarui status menjadi{' '}
            {determineOrderStatus(status)}
          </AO.TitleText>
          <AO.CustomButtonsWrapper>
            <AO.CustomButton
              className='danger'
              onClick={() => {
                setStatus(props.status);
                setIsModalConfirmOpen(false);
              }}
            >
              Tutup
            </AO.CustomButton>
            <AO.CustomButton
              className='green'
              onClick={() => {
                handleConfirm(props.order_id);
                setIsModalConfirmOpen(false);
              }}
            >
              Lanjutkan
            </AO.CustomButton>
          </AO.CustomButtonsWrapper>
        </AO.ModalConfirmationContainer>
      </DialogModal>
    </DetailCardContainer>
  );
};

export default AdminOrderCard;
