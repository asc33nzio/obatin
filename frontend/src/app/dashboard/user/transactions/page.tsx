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
import { TxFilterItf } from '@/types/transactionTypes';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useState } from 'react';
import { useObatinDispatch } from '@/redux/store/store';
import { setTxState } from '@/redux/reducers/txSlice';
import { useModal } from '@/hooks/useModal';
import TransactionCard from '@/components/molecules/cards/TransactionCard';
import Navbar from '@/components/organisms/navbar/Navbar';

const TransactionHistoryPage = (): React.ReactElement => {
  const dispatch = useObatinDispatch();
  const { openModal } = useModal();
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

  const response = {
    message: 'ok',
    pagination: {
      page: 1,
      page_count: 1,
      total_records: 2,
      limit: 10,
    },
    data: [
      {
        order_id: 3,
        payment_id: 3,
        invoice_number: 'INVOBTN-07-05-2024-3',
        status: 'waiting_payment',
        number_items: 2,
        subtotal: 478440,
        created_at: '07-05-2024 22:23',
        shipping: {
          cost: 2810,
          code: 'ofc_courier',
          name: 'Obatin Kurir',
          type: 'official',
        },
        pharmacy: {
          id: 96797,
          name: 'Sentosa Farma Apotek 477',
          address:
            'Jl. Edy IV No.21, RW.6, Guntur, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12980, Indonesia',
          city_id: 153,
          lat: '-6.2067855',
          lng: '106.8322247',
          pharmacist_name: 'Tia Edwards',
          pharmacist_license: '2024-14-477-47714',
          pharmacist_phone: '08123414477',
          opening_time: '08:00:00',
          closing_time: '21:00:00',
          operational_days: ['Senin', 'Rabu', 'Jumat'],
          partner_id: 14,
          distance: null,
          total_weight: 0,
          subtotal_pharmacy: 0,
          cart_items: [
            {
              id: 1,
              product_id: 1,
              prescription_id: null,
              pharmacy_product_id: 9679632,
              name: 'Combantrin Jeruk Sirup 10 ml',
              quantity: 230,
              thumbnail_url:
                'https://d2qjkwm11akmwu.cloudfront.net/thumbnails/9387-1665779695.jpeg',
              selling_unit: 'Per Botol',
              order_id: 3,
              price: 22822,
              stock: null,
              slug: 'combantrin-jeruk-sirup-10-ml',
              weight: 63,
              is_prescription_required: false,
            },
            {
              id: 2,
              product_id: 12,
              name: 'Oralit 200 4.1 g 1 Sachet',
              quantity: 20,
              prescription_id: null,
              pharmacy_product_id: 9679635,
              thumbnail_url:
                'https://d2qjkwm11akmwu.cloudfront.net/thumbnails/150718_5-11-2020_14-55-53-1665779679.jpeg',
              selling_unit: 'Per Sachet',
              order_id: 3,
              price: 1100,
              stock: null,
              slug: 'oralit-200-4-1-g-1-sachet',
              weight: 642,
              is_prescription_required: false,
            },
          ],
        },
      },
      {
        order_id: 3,
        payment_id: 3,
        invoice_number: 'INVOBTN-07-05-2024-3',
        status: 'waiting_payment',
        number_items: 2,
        subtotal: 478440,
        created_at: '07-05-2024 22:23',
        shipping: {
          cost: 2810,
          code: 'ofc_courier',
          name: 'Obatin Kurir',
          type: 'official',
        },
        pharmacy: {
          id: 96797,
          name: 'Sentosa Farma Apotek 510',
          address:
            'Jl. Edy IV No.21, RW.6, Guntur, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12980, Indonesia',
          city_id: 153,
          lat: '-6.2067855',
          lng: '106.8322247',
          pharmacist_name: 'Tia Edwards',
          pharmacist_license: '2024-14-477-47714',
          pharmacist_phone: '08123414477',
          opening_time: '08:00:00',
          closing_time: '21:00:00',
          operational_days: ['Senin', 'Rabu', 'Jumat'],
          partner_id: 14,
          distance: null,
          total_weight: 0,
          subtotal_pharmacy: 0,
          cart_items: [
            {
              id: 1,
              product_id: 1,
              prescription_id: null,
              pharmacy_product_id: 9679632,
              name: 'example Jeruk Sirup 10 ml',
              quantity: 230,
              thumbnail_url:
                'https://d2qjkwm11akmwu.cloudfront.net/thumbnails/9387-1665779695.jpeg',
              selling_unit: 'Per Botol',
              order_id: 3,
              price: 22822,
              stock: null,
              slug: 'combantrin-jeruk-sirup-10-ml',
              weight: 63,
              is_prescription_required: false,
            },
            {
              id: 2,
              product_id: 12,
              name: 'Oralit 200 4.1 g 1 Sachet',
              quantity: 20,
              prescription_id: null,
              pharmacy_product_id: 9679635,
              thumbnail_url:
                'https://www.redwolf.in/image/cache/catalog/stickers/rick-and-morty-rick-head-sticker-600x800.jpg?m=1687862089',
              selling_unit: 'Per Sachet',
              order_id: 3,
              price: 1100,
              stock: null,
              slug: 'oralit-200-4-1-g-1-sachet',
              weight: 642,
              is_prescription_required: false,
            },
            {
              id: 2,
              product_id: 12,
              name: 'Oralit 200 4.1 g 1 Sachet',
              quantity: 20,
              prescription_id: null,
              pharmacy_product_id: 9679635,
              thumbnail_url:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1R28Hy9Wf3qhwUDl9Pss3e7LOQ5E27WL8GYMfmHvvQw&s',
              selling_unit: 'Per Sachet',
              order_id: 3,
              price: 1100,
              stock: null,
              slug: 'oralit-200-4-1-g-1-sachet',
              weight: 642,
              is_prescription_required: false,
            },
            {
              id: 2,
              product_id: 12,
              name: 'Oralit 200 4.1 g 1 Sachet',
              quantity: 20,
              prescription_id: null,
              pharmacy_product_id: 9679635,
              thumbnail_url:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1R28Hy9Wf3qhwUDl9Pss3e7LOQ5E27WL8GYMfmHvvQw&s',
              selling_unit: 'Per Sachet',
              order_id: 3,
              price: 1100,
              stock: null,
              slug: 'oralit-200-4-1-g-1-sachet',
              weight: 642,
              is_prescription_required: false,
            },
            {
              id: 2,
              product_id: 12,
              name: 'Oralit 200 4.1 g 1 Sachet',
              quantity: 20,
              prescription_id: null,
              pharmacy_product_id: 9679635,
              thumbnail_url:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1R28Hy9Wf3qhwUDl9Pss3e7LOQ5E27WL8GYMfmHvvQw&s',
              selling_unit: 'Per Sachet',
              order_id: 3,
              price: 1100,
              stock: null,
              slug: 'oralit-200-4-1-g-1-sachet',
              weight: 642,
              is_prescription_required: false,
            },
          ],
        },
      },
    ],
  };

  // eslint-disable-next-line
  const paginationInfo = response.pagination;

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
          {response.data.map((order, index) => {
            const handleOpenViewMore = () => {
              dispatch(setTxState(order));
              openModal('view-more-tx');
            };

            return (
              <TransactionCard
                key={`txCard${order.invoice_number}${index}`}
                status={order.status}
                totalAmount={order.subtotal}
                invoiceNumber={order.invoice_number}
                pharmacy={order.pharmacy}
                products={order.pharmacy.cart_items}
                createdAt={order.created_at}
                shippingInfo={order.shipping}
                handleOpenViewMore={handleOpenViewMore}
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
