import { useToast } from '@/hooks/useToast';
import AO from '@/styles/pages/admin/AdminOrders.styles';
import { PaginationParamsItf } from '@/types/request';
import { APIResponseItf } from '@/types/response';
import { PaymentItf } from '@/types/transactionTypes';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import useSWR, { mutate } from 'swr';
import { DialogModal } from '../modal/dialogModal/DialogModal';
import PaginationComponent from '../pagination/PaginationComponent';

interface GetPaymentsParams extends PaginationParamsItf {}

const AdminPaymentsTable = () => {
  const { setToast } = useToast();
  const accessToken = getCookie('access_token');
  const [getPaymentsParams, setGetPaymentsParams] = useState<GetPaymentsParams>(
    {
      limit: null,
      page: null,
    },
  );
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<PaymentItf | null>();
  const [refetch, setRefetch] = useState<boolean>(false);

  const fetcherGet = (url: string) =>
    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + url, {
        params: { ...getPaymentsParams },
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

  const { data: res, isLoading } = useSWR<APIResponseItf<Array<PaymentItf>>>(
    `/payments/pending`,
    fetcherGet,
  );

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
  }, [getPaymentsParams, refetch]);

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
          placeholder='limit'
          onBlur={(e) => {
            if (!isNaN(parseInt(e.target.value))) {
              setGetPaymentsParams({
                ...getPaymentsParams,
                limit: e.target.value,
              });
              return;
            }
            setGetPaymentsParams({
              ...getPaymentsParams,
              limit: null,
            });
          }}
          defaultValue={getPaymentsParams.limit || ''}
          type='number'
        />
        <AO.CustomInput
          type='button'
          value='Perbarui'
          onClick={() => {
            setRefetch(!refetch);
          }}
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
            {res?.data?.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'green' : ''}>
                <td>{item.invoice_number}</td>
                <td>{item.payment_method}</td>
                <td>Rp. {item.total_payment.toLocaleString()}</td>
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
                setIsModalConfirmOpen(false);
              }}
            >
              Lanjutkan
            </AO.CustomButton>
          </AO.CustomButtonsWrapper>
        </AO.ModalConfirmationContainer>
      </DialogModal>
      <PaginationComponent
        page={res?.pagination?.page || 1}
        totalPages={res?.pagination?.page_count || 1}
        handleNextPage={() => {
          setGetPaymentsParams({
            ...getPaymentsParams,
            page: (parseInt(getPaymentsParams?.page || '1') + 1).toString(),
          });
        }}
        handlePrevPage={() => {
          setGetPaymentsParams({
            ...getPaymentsParams,
            page: (parseInt(getPaymentsParams?.page || '2') - 1).toString(),
          });
        }}
        goToPage={(i) => {
          setGetPaymentsParams({
            ...getPaymentsParams,
            page: i.toString(),
          });
        }}
      />
    </AO.TableFilterWrapper>
  );
};

export default AdminPaymentsTable;
