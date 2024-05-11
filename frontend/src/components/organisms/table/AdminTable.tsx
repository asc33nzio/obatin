/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useToast } from '@/hooks/useToast';
import AO from '@/styles/pages/admin/AdminOrders.styles';
import { PaymentItf, TxItf } from '@/types/transactionTypes';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { DialogModal } from '../modal/dialogModal/DialogModal';
import AdminOrderCard from '@/components/molecules/cards/AdminOrderCard';
import useSWR, { mutate } from 'swr';
import { PropagateLoader } from 'react-spinners';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

const AdminOrdersTable = () => {
  const { setToast } = useToast();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const accessToken = getCookie('access_token');
  const [status, setStatus] = useState<string | null>(
    searchParams.get('status'),
  );
  const [limit, setLimit] = useState<string | null>(searchParams.get('limit'));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<TxItf>();

  const fetcherGet = (url: string) =>
    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + url, {
        params: {
          status: status === 'all' ? null : status,
          limit: limit,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data.data);

  const {
    data: orders,
    error: errorGetOrders,
    isLoading,
  } = useSWR<Array<TxItf>>(`/shop/orders`, fetcherGet);

  if (errorGetOrders) {
    setToast({
      showToast: true,
      toastMessage: 'Maaf terjadi kesalahan',
      toastType: 'error',
      resolution: 'desktop',
      orientation: 'center',
    });
  }

  useEffect(() => {
    mutate('/shop/orders');
  }, [status, limit]);

  if (isLoading) {
    return (
      <>
        <PropagateLoader />
      </>
    );
  }

  return (
    <AO.TableFilterWrapper>
      <AO.FilterContainer>
        <AO.LimitInput
          placeholder='limit'
          onBlur={(e) => {
            if (!isNaN(parseInt(e.target.value))) {
              const params = new URLSearchParams(searchParams);
              params.set('limit', e.target.value);
              setLimit(e.target.value);
              replace(`${pathName}?${params.toString()}`);
            }
          }}
          type='number'
        />
        <AO.CustomSelect
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            params.set('status', e.target.value);
            setStatus(e.target.value);
            replace(`${pathName}?${params.toString()}`);
          }}
          defaultValue={determineStatus(status || '')}
        >
          <option value='all'>Semua</option>
          <option value='waiting_payment'>Menunggu Pembayaran</option>
          <option value='waiting_confirmation'>Menunggu Konfirmasi</option>
          <option value='processed'>Diproses</option>
          <option value='sent'>Dikirim</option>
          <option value='confirmed'>Diterima</option>
          <option value='cancelled'>Dibatalkan</option>
        </AO.CustomSelect>
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
            {orders?.map((item, index) => (
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

const AdminPaymentsTable = () => {
  const { setToast } = useToast();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const accessToken = getCookie('access_token');
  const [limit, setLimit] = useState<string | null>(searchParams.get('limit'));
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<PaymentItf | null>();
  const [refetch, setRefetch] = useState<boolean>(false);

  const fetcherGet = (url: string) =>
    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + url, {
        params: {
          limit: limit,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data.data);

  const {
    data: orders,
    error: errorGetOrders,
    isLoading,
  } = useSWR<Array<PaymentItf>>(`/payments/pending`, fetcherGet);

  if (errorGetOrders) {
    setToast({
      showToast: true,
      toastMessage: 'Maaf terjadi kesalahan',
      toastType: 'error',
      resolution: 'desktop',
      orientation: 'center',
    });
  }

  const handleConfirm = async (payment: PaymentItf) => {
    try {
      const _ = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/confirmation`,
        {
          payment_id: payment?.id,
          user_id: payment?.user_id,
          is_confirmed: payment?.is_confirmed,
        },
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
    mutate('/payments/pending');
  }, [limit, refetch]);

  if (isLoading) {
    return (
      <>
        <PropagateLoader />
      </>
    );
  }

  return (
    <AO.TableFilterWrapper>
      <AO.FilterContainer>
        <AO.LimitInput
          placeholder='limit'
          onBlur={(e) => {
            if (!isNaN(parseInt(e.target.value))) {
              const params = new URLSearchParams(searchParams);
              params.set('limit', e.target.value);
              setLimit(e.target.value);
              replace(`${pathName}?${params.toString()}`);
            }
          }}
          type='number'
        />
      </AO.FilterContainer>
      <AO.TableContainer>
        <AO.Table>
          <thead>
            <tr>
              <th>No Invoice</th>
              <th>Metode Pembayaran</th>
              <th>Total Bayar</th>
              <th>Bukti Pembayaran</th>
              <th>Status</th>
              <th>Tanggal Bayar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'green' : ''}>
                <td>{item.invoice_number}</td>
                <td>{item.payment_method}</td>
                <td>{item.total_payment}</td>
                <td>
                  <a target='blank' href={`${item.payment_proof_url}`}>
                    Lihat Bukti
                  </a>
                </td>
                <td>
                  {item.is_confirmed ? 'Sudah Disetujui' : 'Belum Disetujui'}
                </td>
                <td>{item.created_at}</td>
                <td>
                  <AO.CustomButtonsWrapper>
                    <AO.CustomButton
                      className='danger'
                      onClick={() => {
                        setIsModalConfirmOpen(true);
                        setSelectedAction({ ...item, is_confirmed: false });
                      }}
                    >
                      Tolak
                    </AO.CustomButton>
                    <AO.CustomButton
                      className='green'
                      onClick={() => {
                        setIsModalConfirmOpen(true);
                        setSelectedAction({ ...item, is_confirmed: true });
                      }}
                    >
                      Setuju
                    </AO.CustomButton>
                  </AO.CustomButtonsWrapper>
                </td>
              </tr>
            ))}
          </tbody>
        </AO.Table>
      </AO.TableContainer>
      <DialogModal
        isOpen={isModalConfirmOpen}
        hasCloseBtn
        onClose={() => setIsModalConfirmOpen(false)}
      >
        <AO.ModalConfirmationContainer>
          <AO.TitleText>
            Apakah anda yakin akan{' '}
            {selectedAction?.is_confirmed ? 'menyetujui' : 'menolak'}{' '}
            pembayaran?
          </AO.TitleText>
          <AO.CustomButtonsWrapper>
            <AO.CustomButton
              className='danger'
              onClick={() => setIsModalConfirmOpen(false)}
            >
              Tutup
            </AO.CustomButton>
            <AO.CustomButton
              className='green'
              onClick={() => {
                handleConfirm(selectedAction as PaymentItf);
                setRefetch(!refetch);
                setIsModalConfirmOpen(false);
              }}
            >
              Lanjutkan
            </AO.CustomButton>
          </AO.CustomButtonsWrapper>
        </AO.ModalConfirmationContainer>
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

  return 'Semua';
};

const AdminTables = {
  Orders: AdminOrdersTable,
  Payments: AdminPaymentsTable,
};

export default AdminTables;
