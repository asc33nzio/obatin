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
import useSWR, { mutate } from 'swr';
import { PropagateLoader } from 'react-spinners';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { APIResponseItf } from '@/types/response';
import PaginationComponent from '../pagination/PaginationComponent';
import { PaginationParamsItf } from '@/types/request';
import { PharmacyType } from '@/types/pharmacyType';
import PharmacyListModalContent from '../modal/modalContent/PharmacyListModalContent';
import { determineOrderStatus } from './AdminOrderTable';

interface GetOrdersParams extends PaginationParamsItf {
  status?: string | null;
  invoice_number?: string | null;
  partner_id?: string | null;
  pharmacy_id?: string | null;
}

const PartnerOrdersTable = () => {
  const { setToast } = useToast();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const accessToken = getCookie('access_token');
  const [getOrdersParams, setGetOrdersParams] = useState<GetOrdersParams>({
    status:
      searchParams.get('status') === 'all' ? null : searchParams.get('status'),
    invoice_number: searchParams.get('invoice_number'),
    limit: searchParams.get('limit'),
    page: searchParams.get('page'),
    pharmacy_id: null,
    partner_id: null,
  });
  const [isModalDetailOpen, setIsModalDetailOpen] = useState<boolean>(false);
  const [isModalPharmacyOpen, setIsModalPharmacyOpen] =
    useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<TxItf>();
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyType>();

  const fetcherGet = (url: string) =>
    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + url, {
        params: { ...getOrdersParams },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data)
      .catch((error) =>
        setToast({
          showToast: true,
          toastMessage: error.response.data.message,
          toastType: 'error',
          resolution: 'desktop',
          orientation: 'center',
        }),
      );

  const { data: res, isLoading } = useSWR<APIResponseItf<Array<TxItf>>>(
    `/shop/orders`,
    fetcherGet,
  );

  const handleSetSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    replace(`${pathName}?${params.toString()}`);
  };

  const handleDeleteSearchParams = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    replace(`${pathName}?${params.toString()}`);
  };

  const handleClearFilter = () => {
    setGetOrdersParams({
      status: null,
      limit: null,
      page: null,
      invoice_number: null,
      partner_id: null,
      pharmacy_id: null,
    });
    setSelectedPharmacy({});
  };

  useEffect(() => {
    mutate('/shop/orders');
  }, [getOrdersParams]);

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
        <AO.CustomInput
          type='button'
          value={
            selectedPharmacy?.name ? selectedPharmacy.name : 'Pilih Apotek'
          }
          onClick={() => setIsModalPharmacyOpen(true)}
        />
        <AO.CustomInput
          placeholder='Limit'
          onBlur={(e) => {
            if (!isNaN(parseInt(e.target.value))) {
              handleSetSearchParams('limit', e.target.value);
              setGetOrdersParams({
                ...getOrdersParams,
                limit: e.target.value,
                page: '1',
              });
              return;
            }
            handleDeleteSearchParams('limit');
            setGetOrdersParams({ ...getOrdersParams, limit: null, page: '1' });
          }}
          defaultValue={getOrdersParams.limit || ''}
          type='number'
        />
        <AO.CustomInput
          placeholder='Nomor Invoice'
          onBlur={(e) => {
            if (e.target.value === '') {
              handleDeleteSearchParams('invoice_number');
              setGetOrdersParams({
                ...getOrdersParams,
                invoice_number: null,
                page: '1',
              });
              return;
            }
            handleSetSearchParams('invoice_number', e.target.value);
            setGetOrdersParams({
              ...getOrdersParams,
              invoice_number: e.target.value,
              page: '1',
            });
          }}
          defaultValue={getOrdersParams.invoice_number || ''}
          type='text'
        />
        <AO.CustomSelect
          onChange={(e) => {
            handleSetSearchParams('status', e.target.value);
            setGetOrdersParams({
              ...getOrdersParams,
              status: e.target.value !== 'all' ? e.target.value : null,
              page: '1',
            });
          }}
          defaultValue={determineOrderStatus(getOrdersParams.status || '')}
        >
          <option value='all'>Semua</option>
          <option value='waiting_payment'>Menunggu Pembayaran</option>
          <option value='waiting_confirmation'>Menunggu Konfirmasi</option>
          <option value='processed'>Diproses</option>
          <option value='sent'>Dikirim</option>
          <option value='confirmed'>Diterima</option>
          <option value='cancelled'>Dibatalkan</option>
        </AO.CustomSelect>
        <AO.CustomInput
          type='button'
          value='Perbarui'
          onClick={() => {
            replace(`${pathName}`);
            handleClearFilter();
          }}
        />
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
            {res?.data?.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'green' : ''}>
                <td>{item.invoice_number}</td>
                <td>{item.pharmacy.name}</td>
                <td>{item.user_name}</td>
                <td>{item.created_at}</td>
                <td>Rp. {item.subtotal.toLocaleString()}</td>
                <td>{determineOrderStatus(item.status)}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedOrder({ ...item });
                      setIsModalDetailOpen(true);
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
        isOpen={isModalDetailOpen}
        hasCloseBtn
        onClose={() => setIsModalDetailOpen(false)}
      >
        <AdminOrderCard {...(selectedOrder as TxItf)} />
      </DialogModal>
      <DialogModal
        isOpen={isModalPharmacyOpen}
        hasCloseBtn
        onClose={() => setIsModalPharmacyOpen(false)}
      >
        <PharmacyListModalContent
          handleChangePharmacy={(id, name) => {
            setGetOrdersParams({
              ...getOrdersParams,
              pharmacy_id: id?.toString(),
              page: '1',
            });
            setSelectedPharmacy({ ...selectedPharmacy, id, name });
            setIsModalPharmacyOpen(false);
          }}
        />
      </DialogModal>
      <PaginationComponent
        page={res?.pagination?.page || 1}
        totalPages={res?.pagination?.page_count || 1}
        handleNextPage={() => {
          handleSetSearchParams(
            'page',
            (parseInt(getOrdersParams?.page || '1') + 1).toString(),
          );
          setGetOrdersParams({
            ...getOrdersParams,
            page: (parseInt(getOrdersParams?.page || '1') + 1).toString(),
          });
        }}
        handlePrevPage={() => {
          handleSetSearchParams(
            'page',
            (parseInt(getOrdersParams?.page || '2') - 1).toString(),
          );
          setGetOrdersParams({
            ...getOrdersParams,
            page: (parseInt(getOrdersParams?.page || '2') - 1).toString(),
          });
        }}
        goToPage={(i) => {
          handleSetSearchParams('page', i.toString());
          setGetOrdersParams({
            ...getOrdersParams,
            page: i.toString(),
          });
        }}
      />
    </AO.TableFilterWrapper>
  );
};

export default PartnerOrdersTable;
