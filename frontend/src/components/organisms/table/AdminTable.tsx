/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useToast } from '@/hooks/useToast';
import AO from '@/styles/pages/admin/AdminOrders.styles';
import { TxItf } from '@/types/transactionTypes';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { DialogModal } from '../modal/dialogModal/DialogModal';
import AdminOrderCard from '@/components/molecules/cards/AdminOrderCard';

const AdminOrdersTable = () => {
  const { setToast } = useToast();
  const accessToken = getCookie('access_token');
  const [orders, setOrders] = useState<Array<TxItf>>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<TxItf>();

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/orders`,
        {
          params: {
            status: status,
            limit: limit,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setOrders(response.data.data);
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
    fetchOrders();
  }, [status, limit]);

  return (
    <AO.TableFilterWrapper>
      <AO.FilterContainer>
        <AO.LimitInput
          placeholder='limit'
          onBlur={(e) => {
            if (!isNaN(parseInt(e.target.value))) {
              setLimit(parseInt(e.target.value));
            }
          }}
          type='number'
        />
        <AO.FilterStatus onChange={(e) => setStatus(e.target.value)}>
          <option value='waiting_payment'>Menunggu Pembayaran</option>
          <option value='waiting_confirmation'>Menunggu Konfirmasi</option>
          <option value='processed'>Diproses</option>
          <option value='sent'>Dikirim</option>
          <option value='confirmed'>Diterima</option>
          <option value='cancelled'>Dibatalkan</option>
        </AO.FilterStatus>
      </AO.FilterContainer>
      <AO.TableContainer>
        <AO.Table>
          <thead>
            <tr>
              <th>No Invoice</th>
              <th>Apotek</th>
              <th>Kustomer</th>
              <th>Tanggal Pesan</th>
              <th>Subtotal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'green' : ''}>
                <td>{item.invoice_number}</td>
                <td>{item.pharmacy.name}</td>
                <td>{item.user_name}</td>
                <td>{item.created_at}</td>
                <td>{item.subtotal}</td>
                <td>{determineStatus(item.status)}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedOrder({ ...item });
                      setIsModalOpen(true);
                    }}
                  >
                    Lihat Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </AO.Table>
      </AO.TableContainer>
      <DialogModal
        isOpen={isModalOpen}
        hasCloseBtn
        onClose={() => setIsModalOpen(false)}
      >
        <AdminOrderCard {...(selectedOrder as TxItf)} />
      </DialogModal>
    </AO.TableFilterWrapper>
  );
};

const determineStatus = (status: string): string => {
  if (status === 'waiting_payment') {
    return 'Menunggu Pembayaran';
  }
  if (status === 'waiting_confirmation') {
    return 'Menunggu Konfirmasi';
  }
  if (status === 'processed') {
    return 'Diproses';
  }
  if (status === 'sent') {
    return 'Dikirim';
  }
  if (status === 'confirmed') {
    return 'Diterima';
  }
  if (status === 'cancelled') {
    return 'Dibatalkan';
  }

  return 's';
};

export default AdminOrdersTable;
