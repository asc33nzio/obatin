'use client';
import { Summary } from '@/styles/pages/product/Cart.styles';
import { useObatinSelector } from '@/redux/store/store';
import { getCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';
import { decrypt } from '@/utils/crypto';
import { CartItemItf, TxItf } from '@/types/transactionTypes';
import { useEffect, useState } from 'react';
import { navigateToHome } from '@/app/actions';
import { COLORS } from '@/constants/variables';
import Axios from 'axios';
import styled from 'styled-components';

const PaymentSummaryUploadPaymentContainer = styled.div`
  border: 1px solid ${COLORS.primary_text};
  padding: 10px;
  border: 12px;

  min-width: 30vw;
  height: 75vh;
`;

const PaymentSummaryUploadPaymentSubcontainer = styled.div`
  color: ${COLORS.primary_text};
  padding-bottom: 20px;

  div {
    display: flex;
    justify-content: space-between;

    span {
      padding: 5px 0;
    }

    p {
      padding: 5px 0;
      height: 125px;
      max-width: 275px;
      text-align: end;
      overflow: hidden;
      overflow-wrap: break-word;
      text-overflow: ellipsis;
    }
  }
`;

const PaymentSummaryUploadPayment = (): React.ReactElement => {
  const pharmacyState = useObatinSelector((state) => state?.pharmacy);
  const accessToken = getCookie('access_token');
  const [orderInfo, setOrderInfo] = useState<TxItf>();
  const pathname = usePathname();
  const pid = pathname.split('/').pop();
  const [totalQty, setTotalQty] = useState<number>(0);

  const validatePID = async () => {
    try {
      if (pid === undefined) throw new Error('invalid path');
      const decodedPID = decodeURIComponent(pid);
      const decryptedPID = await decrypt(decodedPID);
      return decryptedPID;
    } catch (_e: any) {
      console.error('this transaction does not exist');
      navigateToHome();
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await Axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/orders?limit=25&page=1&status=waiting_payment`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const pid = await validatePID();
        const currentOrder = response?.data?.data?.find((order: TxItf) => {
          return order.payment_id.toString() === pid;
        });

        const qty = currentOrder.cart_items.reduce(
          (total: number, cartItem: CartItemItf) => {
            return total + cartItem.quantity;
          },
          0,
        );

        setOrderInfo(currentOrder);
        setTotalQty(qty);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, pid]);

  useEffect(() => {
    validatePID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);

  return (
    <>
      <PaymentSummaryUploadPaymentContainer>
        <PaymentSummaryUploadPaymentSubcontainer>
          <h2>Informasi Pesanan</h2>
          <div>
            <span>Nomor Invoice</span>
            <span>{orderInfo?.invoice_number}</span>
          </div>
          <div style={{ marginBottom: '25px' }}>
            <span>Tanggal & Waktu Pembelian</span>
            <span>{orderInfo?.created_at}</span>
          </div>

          <h2>Informasi Apotik</h2>
          <div>
            <span>Nama</span>
            <span>
              {orderInfo?.pharmacy?.name?.charAt(0)?.toUpperCase()}
              {orderInfo?.pharmacy?.name?.slice(
                1,
                orderInfo?.pharmacy?.name?.length,
              )}
            </span>
          </div>
          <div>
            <span>Alamat</span>
            <p>{orderInfo?.pharmacy?.address}</p>
          </div>
          <div>
            <span>Apoteker</span>
            <span>{orderInfo?.pharmacy?.pharmacist_name}</span>
          </div>
          <div>
            <span>No. Telfon</span>
            <span>{orderInfo?.pharmacy?.pharmacist_phone}</span>
          </div>
          <div>
            <span>Checkout</span>
            <span>{totalQty} produk</span>
          </div>
          <div style={{ marginBottom: '25px' }}>
            <span>Harga Barang</span>
            <span>Rp. {orderInfo?.subtotal?.toLocaleString('id-ID')}</span>
          </div>

          <h2>Ekspedisi</h2>
          <div>
            <span>Nama</span>
            <span>{orderInfo?.shipping?.name}</span>
          </div>
          <div>
            <span>Biaya Pengiriman</span>
            <span>
              Rp.&nbsp;
              {orderInfo?.shipping?.cost?.toLocaleString('id-ID')}
            </span>
          </div>
        </PaymentSummaryUploadPaymentSubcontainer>
        <Summary>
          <div>
            <h2>Total Belanja</h2>
            <span>
              Rp.&nbsp;
              {(
                pharmacyState?.checkoutSubtotal +
                pharmacyState?.checkoutShipmentSubtotal
              )?.toLocaleString('id-ID')}
            </span>
          </div>
        </Summary>
      </PaymentSummaryUploadPaymentContainer>
    </>
  );
};

export default PaymentSummaryUploadPayment;
