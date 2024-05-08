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
  OrderItf,
  PharmacyItf,
  ProductItf,
  TxFilterItf,
} from '@/types/transactionTypes';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useState } from 'react';
import TransactionCard from '@/components/molecules/cards/TransactionCard';
import Navbar from '@/components/organisms/navbar/Navbar';

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

  const exampleProduct1: ProductItf = {
    productId: 1,
    pharmacyProductId: 24351,
    perscriptionId: null,
    name: 'example product 1',
    slug: 'valsartan-160-mg-3-strip-10-tablet-strip-obat-rutin',
    quantity: 50,
    thumbnailUrl:
      'https://www.redwolf.in/image/cache/catalog/stickers/rick-and-morty-rick-head-sticker-600x800.jpg?m=1687862089',
    sellingUnit: 'per dus',
    price: 100000,
    weight: 2000,
    isPrescribed: false,
  };

  const exampleProduct2: ProductItf = {
    productId: 50,
    pharmacyProductId: 54551,
    perscriptionId: null,
    name: 'example product 2',
    slug: 'valsartan-160-mg-3-strip-10-tablet-strip-obat-rutin',
    quantity: 35,
    thumbnailUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1R28Hy9Wf3qhwUDl9Pss3e7LOQ5E27WL8GYMfmHvvQw&s',
    sellingUnit: 'per dus',
    price: 100000,
    weight: 500,
    isPrescribed: false,
  };

  const examplePharmacy1: PharmacyItf = {
    id: 1,
    cityId: 1,
    partnerId: 2,
    name: 'Happy Pharma',
    address: 'Jl. manarupa abc, Jakarta Selatan, Sopo Del 18729',
    lat: '1.123',
    lng: '2.123',
    pharmacistName: 'John',
    pharmacistLicense: 'DFGHJK',
    pharmacistPhone: '08527272839',
  };

  const examplePharmacy2: PharmacyItf = {
    id: 11,
    cityId: 11,
    partnerId: 12,
    name: 'Sad Pharma',
    address: 'Jl. Ajuuubababa abc, Jakarta Selatan, Sopo Del 18729',
    lat: '5.123',
    lng: '2.123',
    pharmacistName: 'Alice',
    pharmacistLicense: 'iajnsdiIBA',
    pharmacistPhone: '99988877651',
  };

  // const examplePaginationInfo: PaginationInfoItf = {
  //   currentPage: 1,
  //   totalPages: 10,
  //   limit: 5,
  //   totalEntries: 50,
  // };

  const exampleOrders: Array<OrderItf> = [
    {
      status: 'waitingUserPayment',
      totalAmount: 500000,
      invoiceNumber: 'OBTN-XXX-8877769420',
      pharmacy: examplePharmacy1,
      createdAt: '06-02-2024 16:37',
      products: [
        exampleProduct1,
        exampleProduct2,
        exampleProduct1,
        exampleProduct2,
        exampleProduct1,
        exampleProduct2,
      ],
      shippingInfo: {
        cost: 100000,
        code: 'TKI-77',
        name: 'TIKI',
        type: 'official',
      },
    },
    {
      createdAt: '10-03-2024 16:37',
      status: 'waitingConfirmation',
      totalAmount: 300000,
      invoiceNumber: 'OBTN-ZZZ-8877766333',
      pharmacy: examplePharmacy2,
      products: [
        exampleProduct1,
        exampleProduct2,
        exampleProduct1,
        exampleProduct2,
      ],
      shippingInfo: {
        cost: 50000,
        code: 'JNE-77',
        name: 'JNE',
        type: 'official',
      },
    },
    {
      createdAt: '25-12-2024 15:37',
      status: 'processed',
      totalAmount: 300000,
      invoiceNumber: 'OBTN-AAA-8877766333',
      pharmacy: examplePharmacy2,
      products: [exampleProduct1],
      shippingInfo: {
        cost: 150000,
        code: 'XGZ-57',
        name: 'XGZ',
        type: 'official',
      },
    },
    {
      createdAt: '25-12-2024 15:37',
      status: 'sent',
      totalAmount: 300000,
      invoiceNumber: 'OBTN-AAA-8877766333',
      pharmacy: examplePharmacy2,
      products: [exampleProduct1],
      shippingInfo: {
        cost: 150000,
        code: 'XGZ-57',
        name: 'XGZ',
        type: 'official',
      },
    },
    {
      createdAt: '25-12-2024 15:37',
      status: 'received',
      totalAmount: 300000,
      invoiceNumber: 'OBTN-AAA-8877766333',
      pharmacy: examplePharmacy2,
      products: [exampleProduct1],
      shippingInfo: {
        cost: 150000,
        code: 'XGZ-57',
        name: 'XGZ',
        type: 'official',
      },
    },
    {
      createdAt: '25-12-2024 15:37',
      status: 'cancelled',
      totalAmount: 300000,
      invoiceNumber: 'OBTN-AAA-8877766333',
      pharmacy: examplePharmacy2,
      products: [exampleProduct1],
      shippingInfo: {
        cost: 150000,
        code: 'XGZ-57',
        name: 'XGZ',
        type: 'official',
      },
    },
  ];

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
          {exampleOrders.map((order, index) => {
            return (
              <TransactionCard
                key={`txCard${order.invoiceNumber}${index}`}
                status={order.status}
                totalAmount={order.totalAmount}
                invoiceNumber={order.invoiceNumber}
                pharmacy={order.pharmacy}
                products={order.products}
                createdAt={order.createdAt}
                shippingInfo={order.shippingInfo}
              />
            );
          })}
        </TxMainContainer>

        <PaginationDiv>PAGINATION</PaginationDiv>
      </TxHistoryContentContainer>
    </TxHistoryPageContainer>
  );
};

export default TransactionHistoryPage;
