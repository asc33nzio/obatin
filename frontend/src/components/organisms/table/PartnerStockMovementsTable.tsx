/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useToast } from '@/hooks/useToast';
import AO from '@/styles/pages/admin/AdminOrders.styles';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { DialogModal } from '../modal/dialogModal/DialogModal';
import useSWR, { mutate } from 'swr';
import { PropagateLoader } from 'react-spinners';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { APIResponseItf } from '@/types/response';
import PaginationComponent from '../pagination/PaginationComponent';
import { PaginationParamsItf } from '@/types/request';
import { PharmacyType } from '@/types/pharmacyType';
import PharmacyListModalContent from '../modal/modalContent/PharmacyListModalContent';

interface StockMovementItf {
  id: number;
  pharmacy_product_id: number;
  delta: number;
  is_addition: boolean;
  movement_type: string;
  created_at: string;
  product_id: number;
  product_name: string;
  pharmacy_id: number;
  pharmacy_name: string;
}

interface GetOrdersParams extends PaginationParamsItf {
  pharmacy_id?: string | null;
  product_id?: string | null;
}

const PartnerStockMovementsTable = () => {
  const { setToast } = useToast();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const accessToken = getCookie('access_token');
  const [getOrdersParams, setGetOrdersParams] = useState<GetOrdersParams>({
    limit: searchParams.get('limit'),
    page: searchParams.get('page'),
    product_id: null,
    pharmacy_id: null,
  });
  const [isModalPharmacyOpen, setIsModalPharmacyOpen] =
    useState<boolean>(false);
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

  const { data: res, isLoading } = useSWR<
    APIResponseItf<Array<StockMovementItf>>
  >(`/stock-movements`, fetcherGet);

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
      limit: null,
      page: null,
      pharmacy_id: null,
      product_id: null,
    });
    setSelectedPharmacy({});
  };

  useEffect(() => {
    mutate('/stock-movements');
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
              <th>Tanggal</th>
              <th>Produk</th>
              <th>Apotek</th>
              <th>Klasifikasi</th>
              <th>Jumlah Mutasi</th>
              <th>Tipe Mutasi</th>
            </tr>
          </thead>
          <tbody>
            {res?.data?.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'green' : ''}>
                <td>{item.created_at.replace('T', ' ').split('.')[0]}</td>
                <td>{item.product_name}</td>
                <td>{item.pharmacy_name}</td>
                <td className={item.is_addition ? 'green' : 'red'}>
                  {item.is_addition ? 'Penambahan' : 'Pengurangan'}
                </td>
                <td className={item.is_addition ? 'green' : 'red'}>
                  {item.delta} unit penjualan
                </td>
                <td>{determineMutationType(item.movement_type)}</td>
              </tr>
            ))}
          </tbody>
        </AO.Table>
      </AO.TableContainer>
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

export default PartnerStockMovementsTable;

const determineMutationType = (type: string): string => {
  if (type === 'manual_addition') {
    return 'Penambahan/Pengurangan Manual';
  }
  if (type === 'internal_mutation') {
    return 'Mutasi Internal/Otomatis';
  }
  return 'Penjualan';
};
