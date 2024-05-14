'use client';
import {
  ClearTxFilterButton,
  PaginationDiv,
  TxFilterButton,
  TxFilterContainer,
  TxHistoryContentContainer,
  TxHistoryPageContainer,
  TxMainContainer,
} from '@/styles/pages/dashboard/transactions/Transactions.styles';
import {
  PaginationInfoItf,
  TxFilterItf,
  TxItf,
  apiFilterMapTypes,
} from '@/types/transactionTypes';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEffect, useState } from 'react';
import { useObatinDispatch } from '@/redux/store/store';
import { setTxState } from '@/redux/reducers/txSlice';
import { useModal } from '@/hooks/useModal';
import { getCookie } from 'cookies-next';
import { useToast } from '@/hooks/useToast';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { ModalType } from '@/types/modalTypes';
import TransactionCard from '@/components/molecules/cards/TransactionCard';
import Navbar from '@/components/organisms/navbar/Navbar';
import Axios from 'axios';
import PaginationComponent from '@/components/organisms/pagination/PaginationComponent';

const TransactionHistoryPage = (): React.ReactElement => {
  const dispatch = useObatinDispatch();
  const { openModal } = useModal();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const emitter = useEventEmitter();
  const accessToken = getCookie('access_token');
  const [chosenFilter, setChosenFilter] = useState<TxFilterItf>({
    all: false,
    waitingUserPayment: false,
    waitingConfirmation: false,
    processed: false,
    sent: false,
    received: false,
    cancelled: false,
  });
  const [orders, setOrders] = useState<Array<TxItf>>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfoItf>({
    limit: 0,
    page: 0,
    page_count: 0,
    total_records: 0,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  const apiFilterMap = {
    all: '',
    waitingUserPayment: 'waiting_payment',
    waitingConfirmation: 'waiting_confirmation',
    processed: 'processed',
    sent: 'sent',
    received: 'confirmed',
    cancelled: 'cancelled',
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);

      const statusFilter = Object.keys(chosenFilter)
        .filter((key: keyof TxFilterItf) => chosenFilter[key])
        .map((key: string) => apiFilterMap[key as apiFilterMapTypes])
        .toString();

      let apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/orders?limit=5&page=${currentPage}`;
      if (statusFilter !== '') apiUrl += `&status=${statusFilter}`;

      const response = await Axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPaginationInfo(response.data.pagination);
      setOrders(response.data.data);
    } catch (error) {
      console.log(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, telah terjadi kesalahan',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const triggerModal = async (type: ModalType) => {
    return new Promise<boolean>((resolve) => {
      openModal(type);

      emitter.once('close-modal-fail', () => {
        resolve(false);
      });

      emitter.once('close-modal-ok', () => {
        resolve(true);
      });
    });
  };

  const handleCompleteOrder = async (order_id: number) => {
    try {
      const canProceed = await triggerModal('confirm-receive-order');
      if (!canProceed) {
        setToast({
          showToast: true,
          toastMessage:
            'Pesanan anda akan secara otomatis diselesaikan dalam 2 x 24 jam',
          toastType: 'ok',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      await Axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/orders/${order_id}`,
        {
          status: 'confirmed',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setShouldRefetch(!shouldRefetch);
      handleResetFilter();
      handleFilterSelect('received');
      setToast({
        showToast: true,
        toastMessage:
          'Terima kasih atas konfirmasi anda. Semoga anda puas dengan pembelanjaan anda',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, terjadi kesalahan saat konfirmasi penerimaan',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  const handleFilterSelect = (type: keyof TxFilterItf) => {
    if (chosenFilter[type]) {
      setChosenFilter((prevState) => ({
        ...prevState,
        [type]: false,
      }));
      return;
    }

    setChosenFilter({
      all: false,
      waitingUserPayment: false,
      waitingConfirmation: false,
      processed: false,
      sent: false,
      received: false,
      cancelled: false,
      [type]: true,
    });
  };

  const handleResetFilter = () => {
    setChosenFilter({
      all: false,
      waitingUserPayment: false,
      waitingConfirmation: false,
      processed: false,
      sent: false,
      received: false,
      cancelled: false,
    });
  };

  const handlePrevPage = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage === paginationInfo?.page_count) return;
    setCurrentPage(currentPage + 1);
  };

  const handlePageJump = (i: number) => {
    setCurrentPage(i);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, chosenFilter, shouldRefetch]);

  return (
    <TxHistoryPageContainer $isDesktopDisplay={isDesktopDisplay}>
      <Navbar />

      <TxHistoryContentContainer>
        <h1>Riwayat Transaksi</h1>

        <TxFilterContainer>
          <TxFilterButton
            $isChosen={chosenFilter.all}
            $width={100}
            onClick={() => handleFilterSelect('all')}
          >
            Semua
          </TxFilterButton>

          <TxFilterButton
            $isChosen={chosenFilter.waitingUserPayment}
            $width={200}
            onClick={() => handleFilterSelect('waitingUserPayment')}
          >
            Menunggu Pembayaran
          </TxFilterButton>

          <TxFilterButton
            $isChosen={chosenFilter.waitingConfirmation}
            $width={200}
            onClick={() => handleFilterSelect('waitingConfirmation')}
          >
            Menunggu Konfirmasi
          </TxFilterButton>

          <TxFilterButton
            $isChosen={chosenFilter.processed}
            $width={200}
            onClick={() => handleFilterSelect('processed')}
          >
            Diproses
          </TxFilterButton>

          <TxFilterButton
            $isChosen={chosenFilter.sent}
            $width={200}
            onClick={() => handleFilterSelect('sent')}
          >
            Dikirim
          </TxFilterButton>

          <TxFilterButton
            $isChosen={chosenFilter.received}
            $width={200}
            onClick={() => handleFilterSelect('received')}
          >
            Selesai
          </TxFilterButton>

          <TxFilterButton
            $isChosen={chosenFilter.cancelled}
            $width={200}
            onClick={() => handleFilterSelect('cancelled')}
          >
            Gagal
          </TxFilterButton>

          <ClearTxFilterButton onClick={() => handleResetFilter()}>
            Hapus Filter
          </ClearTxFilterButton>
        </TxFilterContainer>

        <TxMainContainer className='scrollbar-5px'>
          {orders.map((order, index) => {
            const handleOpenViewMore = () => {
              dispatch(
                setTxState({
                  products: order.cart_items,
                  info: {
                    order_id: order.order_id,
                    payment_id: order.payment_id,
                    invoice_number: order.invoice_number,
                    status: order.status,
                    number_items: order.number_items,
                    subtotal: order.subtotal,
                    created_at: order.created_at,
                    shipping: order.shipping,
                    pharmacy: order.pharmacy,
                  },
                }),
              );
              openModal('view-more-tx');
            };

            return (
              <TransactionCard
                key={`txCard${order.invoice_number}_${index}`}
                isLoading={isLoading}
                status={order.status}
                subtotal={order.subtotal}
                invoice_number={order.invoice_number}
                pharmacy={order.pharmacy}
                cart_items={order.cart_items}
                created_at={order.created_at}
                shipping={order.shipping}
                order_id={order.order_id}
                payment_id={order.payment_id}
                number_items={order.number_items}
                handleOpenViewMore={handleOpenViewMore}
                handleConfirmOrder={handleCompleteOrder}
              />
            );
          })}
        </TxMainContainer>

        <PaginationDiv>
          <PaginationComponent
            page={paginationInfo?.page}
            totalPages={paginationInfo?.page_count - 1}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            goToPage={handlePageJump}
          />
        </PaginationDiv>
      </TxHistoryContentContainer>
    </TxHistoryPageContainer>
  );
};

export default TransactionHistoryPage;
