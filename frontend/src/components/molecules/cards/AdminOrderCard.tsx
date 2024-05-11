import AO from '@/styles/pages/admin/AdminOrders.styles';
import { TxItf } from '@/types/transactionTypes';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

const PharmacyDetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
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
  align-items: center;
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
`;

const PaymentProof = styled(Image)``;

const ProductListTable = styled.table`
  width: 100%;
`;

const AdminOrderCard = (props: TxItf): React.ReactElement => {
  return (
    <AO.DetailCardContainer>
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
          <PrimaryText>Kustomer : {props?.user_name}</PrimaryText>
          <PrimaryText>Bukti Pembayaran</PrimaryText>
          <PaymentProof
            width={300}
            height={300}
            src={props?.payment_proof_url ?? ''}
            alt='payment proof'
          />
        </PaymentProofContainer>
      </MiddleContainer>
      <ProductListTable>
        <thead>
          <tr>
            <th>Gambar</th>
            <th>Nama</th>
            <th>Satuan</th>
            <th>Harga Satuan</th>
            <th>Jumlah</th>
            <th>Berat</th>
          </tr>
        </thead>
        <tbody>
          {props?.cart_items?.map((item, index) => (
            <tr key={index}>
              <td>
                <Image
                  width={50}
                  height={50}
                  src={item?.thumbnail_url}
                  alt={item?.name}
                />
              </td>
              <td>{item?.name}</td>
              <td>{item?.selling_unit}</td>
              <td>{item?.price}</td>
              <td>{item?.quantity}</td>
              <td>{item?.weight}</td>
            </tr>
          ))}
        </tbody>
      </ProductListTable>
    </AO.DetailCardContainer>
  );
};

export default AdminOrderCard;
