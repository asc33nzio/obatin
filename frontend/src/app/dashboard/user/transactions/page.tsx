'use client';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import {
  ClearTxFilterButton,
  PaginationDiv,
  TxFilterButton,
  TxFilterContainer,
  TxHistoryContentContainer,
  TxHistoryPageContainer,
  TxMainContainer,
} from '@/styles/pages/dashboard/transactions/Transactions.styles';
import { useState } from 'react';
import Navbar from '@/components/organisms/navbar/Navbar';
import { TxFilterItf } from '@/types/transactionTypes';
import TransactionCard, {
  CompactProductInfoItf,
  TransactionCardPropsItf,
} from '@/components/molecules/cards/TransactionCard';

const TransactionHistoryPage = (): React.ReactElement => {
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [chosenFilter, setChosenFilter] = useState<TxFilterItf>({
    all: false,
    waitingUserPayment: false,
    waitingConfirmation: false,
    processed: false,
    sent: false,
    received: false,
    cancelled: false,
  });

  const handleFilterSelect = (type: keyof TxFilterItf) => {
    if (chosenFilter[type]) {
      setChosenFilter((prevState) => ({
        ...prevState,
        [type]: false,
      }));
      return;
    }

    setChosenFilter((prevState) => ({
      ...prevState,
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

  //! Waiting for payment (USER UNPAID)
  //! Waiting for Payment Confirmation(ADMIN CHECK)
  //! Processed
  //! Sent
  //! Order Confirmed/Received
  //! Canceled

  const exampleProduct: CompactProductInfoItf = {
    name: 'example product',
    quantity: 100,
    price: 100000,
    imageUrl:
      'https://www.redwolf.in/image/cache/catalog/stickers/rick-and-morty-rick-head-sticker-600x800.jpg?m=1687862089',
  };

  const examplePharmacy: TransactionCardPropsItf = {
    pharmacy: 'Happy Pharma',
    date: '24-02-2024',
    invoiceNumber: 'OBTN-XXX-8877769420',
    status: 'waitingUserPayment',
    products: [exampleProduct, exampleProduct, exampleProduct, exampleProduct],
  };

  return (
    <TxHistoryPageContainer $isDesktopDisplay={isDesktopDisplay}>
      <Navbar />

      <TxHistoryContentContainer>
        <h1>Sejarah Transaksi</h1>

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

        <TxMainContainer>
          <TransactionCard
            pharmacy={examplePharmacy.pharmacy}
            date={examplePharmacy.date}
            invoiceNumber={examplePharmacy.invoiceNumber}
            status={examplePharmacy.status}
            products={examplePharmacy.products}
          />
          <TransactionCard
            pharmacy={examplePharmacy.pharmacy}
            date={examplePharmacy.date}
            invoiceNumber={examplePharmacy.invoiceNumber}
            status={examplePharmacy.status}
            products={examplePharmacy.products}
          />
          <TransactionCard
            pharmacy={examplePharmacy.pharmacy}
            date={examplePharmacy.date}
            invoiceNumber={examplePharmacy.invoiceNumber}
            status={examplePharmacy.status}
            products={examplePharmacy.products}
          />
          <TransactionCard
            pharmacy={examplePharmacy.pharmacy}
            date={examplePharmacy.date}
            invoiceNumber={examplePharmacy.invoiceNumber}
            status={examplePharmacy.status}
            products={examplePharmacy.products}
          />
        </TxMainContainer>

        <PaginationDiv>PAGINATION</PaginationDiv>
      </TxHistoryContentContainer>
    </TxHistoryPageContainer>
  );
};

export default TransactionHistoryPage;
