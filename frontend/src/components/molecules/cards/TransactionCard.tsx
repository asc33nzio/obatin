import 'moment/locale/id';
import {
  DeliveryStatusBadge,
  SeeMoreDiv,
  TransactionCardContainer,
  TxCardPharmacyName,
  TxHeaders,
  TxProductBreakdown,
} from '@/styles/molecules/cards/TransactionCard.styles';
import { useModal } from '@/hooks/useModal';
import { OrderItf } from '@/types/transactionTypes';
import { useRouter } from 'next/navigation';
import DetailICO from '@/assets/icons/DetailICO';
import Image from 'next/image';
import moment from 'moment';
import DotICO from '@/assets/icons/DotICO';
moment.locale('id');

const TransactionCard = (props: OrderItf): React.ReactElement => {
  const router = useRouter();
  const { openModal } = useModal();
  const splittedDate = props?.createdAt?.split(' ')?.[0];
  const orderTime = props?.createdAt?.split(' ')?.[1];
  const formattedDate = moment(splittedDate, 'DD-MM-YYYY').format(
    'dddd, Do MMMM YYYY',
  );

  const openDetailPharmacyInterface = () => {
    openModal('detail-pharmacy');
  };

  const deliveryStatusMap = {
    waitingUserPayment: 'MENUNGGU PEMBAYARAN',
    waitingConfirmation: 'MENUNGGU KONFIRMASI',
    processed: 'DIPROSES',
    sent: 'DIKIRIM',
    received: 'DITERIMA',
    cancelled: 'DIBATALKAN',
  };

  const deliveryStatusColorMap = {
    waitingUserPayment: '#BD2680',
    waitingConfirmation: '#E7CE50',
    processed: '#00C5C0',
    sent: '#5F5D98',
    received: '#14F500',
    cancelled: '#DE161C',
  };

  return (
    <TransactionCardContainer>
      <TxHeaders>
        <TxCardPharmacyName>
          <DetailICO onClick={openDetailPharmacyInterface} />
          <DeliveryStatusBadge $color={deliveryStatusColorMap[props?.status]}>
            <h1>{deliveryStatusMap[props?.status]}</h1>
          </DeliveryStatusBadge>
        </TxCardPharmacyName>

        <h2>
          {formattedDate} {orderTime}
        </h2>
        <h3>{props.invoiceNumber}</h3>
      </TxHeaders>

      {props?.products?.map((product, index) => {
        if (index > 1) return null;
        return (
          <TxProductBreakdown key={`txProductCard${index}`}>
            <Image
              src={product.thumbnailUrl}
              alt={`txProductIMG${index}`}
              width={75}
              height={75}
              onClick={() => router.replace(`/products/${product.slug}`)}
            />
          </TxProductBreakdown>
        );
      })}

      {props?.products?.length > 2 && (
        <SeeMoreDiv>
          <h4>Lihat {props?.products?.length - 2} produk lainnya</h4>
          <DotICO />
        </SeeMoreDiv>
      )}
    </TransactionCardContainer>
  );
};

export default TransactionCard;
