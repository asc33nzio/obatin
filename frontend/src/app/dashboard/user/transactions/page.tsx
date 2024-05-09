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
} from '@/types/transactionTypes';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEffect, useState } from 'react';
import { useObatinDispatch } from '@/redux/store/store';
import { setTxState } from '@/redux/reducers/txSlice';
import { useModal } from '@/hooks/useModal';
import { getCookie } from 'cookies-next';
import { useToast } from '@/hooks/useToast';
import TransactionCard from '@/components/molecules/cards/TransactionCard';
import Navbar from '@/components/organisms/navbar/Navbar';
import Axios from 'axios';

const TransactionHistoryPage = (): React.ReactElement => {
  const dispatch = useObatinDispatch();
  const { openModal } = useModal();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
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

  const fetchOrders = async () => {
    try {
      const response = await Axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/orders`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
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

    if (type === 'all') {
      setChosenFilter({
        all: true,
        waitingUserPayment: false,
        waitingConfirmation: false,
        processed: false,
        sent: false,
        received: false,
        cancelled: false,
      });
      return;
    }

    setChosenFilter((prevState) => ({
      ...prevState,
      all: false,
      [type]: true,
    }));
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

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                key={`txCard${order.invoice_number}${index}`}
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
              />
            );
          })}
        </TxMainContainer>

        <PaginationDiv>{paginationInfo?.page_count} PAGINATION</PaginationDiv>
      </TxHistoryContentContainer>
    </TxHistoryPageContainer>
  );
};

export default TransactionHistoryPage;
