'use client';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import {
  ClearTxFilterButton,
  TxFilterButton,
  TxFilterContainer,
  TxHistoryContentContainer,
  TxHistoryPageContainer,
} from '@/styles/pages/dashboard/transactions/Transactions.styles';
import Navbar from '@/components/organisms/navbar/Navbar';
import { useState } from 'react';

interface TxFilterItf {
  all: boolean;
  unpaid: boolean;
  waitingConfirmation: boolean;
  processed: boolean;
  received: boolean;
  sent: boolean;
  cancelled: boolean;
}

const TransactionHistoryPage = (): React.ReactElement => {
  const { isDesktopDisplay } = useClientDisplayResolution();
  // eslint-disable-next-line
  const [chosenFilter, setChosenFilter] = useState<TxFilterItf>({
    all: false,
    unpaid: false,
    waitingConfirmation: false,
    processed: false,
    received: false,
    sent: false,
    cancelled: false,
  });

  // const handleFilterSelect = (type: TxFilterItf ) => {
  //   setChosenFilter((prevState) => {
  //     ...prevState,
  //     chosenFilter.type = true
  //   })
  // }

  // Waiting for payment => Waiting for Payment Confirmation
  // => Processed => Sent => Order Received => Canceled

  return (
    <TxHistoryPageContainer $isDesktopDisplay={isDesktopDisplay}>
      <Navbar />

      <TxHistoryContentContainer>
        <h1>Sejarah Transaksi</h1>

        <TxFilterContainer>
          <TxFilterButton $isChosen={chosenFilter.all} $width={100}>
            Semua
          </TxFilterButton>

          <TxFilterButton $isChosen={chosenFilter.unpaid} $width={200}>
            Menunggu Pembayaran
          </TxFilterButton>

          <TxFilterButton $isChosen={chosenFilter.processed} $width={200}>
            Diproses
          </TxFilterButton>

          <TxFilterButton $isChosen={chosenFilter.sent} $width={200}>
            Dikirim
          </TxFilterButton>

          <TxFilterButton $isChosen={chosenFilter.received} $width={200}>
            Selesai
          </TxFilterButton>

          <TxFilterButton $isChosen={true} $width={200}>
            Gagal
          </TxFilterButton>

          <ClearTxFilterButton>Hapus Filter</ClearTxFilterButton>
        </TxFilterContainer>
      </TxHistoryContentContainer>
    </TxHistoryPageContainer>
  );
};

export default TransactionHistoryPage;
