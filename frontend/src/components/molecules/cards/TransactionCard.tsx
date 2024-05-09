import 'moment/locale/id';
import {
  BreakdownCenterDiv,
  BreakdownRightDiv,
  DeliveryStatusBadge,
  //eslint-disable-next-line
  FillerDiv,
  SeeMoreDiv,
  SeparatorDiv,
  TransactionCardContainer,
  TxCardPharmacyName,
  TxHeaders,
  TxProductBreakdown,
} from '@/styles/molecules/cards/TransactionCard.styles';
import { useModal } from '@/hooks/useModal';
import { TxItf } from '@/types/transactionTypes';
import { useRouter } from 'next/navigation';
import DetailICO from '@/assets/icons/DetailICO';
import Image from 'next/image';
import moment from 'moment';
import DotICO from '@/assets/icons/DotICO';
moment.locale('id');

const TransactionCard = (props: TxItf): React.ReactElement => {
  const router = useRouter();
  const { openModal } = useModal();
  const splittedDate = props?.created_at?.split(' ')?.[0];
  const orderTime = props?.created_at?.split(' ')?.[1];
  const formattedDate = moment(splittedDate, 'DD-MM-YYYY').format(
    'dddd, Do MMMM YYYY',
  );

  const handleOpenDetail = () => {
    openModal('detail-pharmacy');
  };

  const deliveryStatusMap = {
    waiting_payment: 'MENUNGGU PEMBAYARAN',
    waiting_confirmation: 'MENUNGGU KONFIRMASI',
    processed: 'DIPROSES',
    sent: 'DIKIRIM',
    confirmed: 'DITERIMA',
    cancelled: 'DIBATALKAN',
  };

  const deliveryStatusColorMap = {
    waiting_payment: '#BD2680',
    waiting_confirmation: '#E7CE50',
    processed: '#00C5C0',
    sent: '#5F5D98',
    confirmed: '#14F500',
    cancelled: '#DE161C',
  };

  return (
    <TransactionCardContainer>
      <TxHeaders>
        <TxCardPharmacyName>
          <DetailICO onClick={handleOpenDetail} />
          <DeliveryStatusBadge $color={deliveryStatusColorMap[props?.status]}>
            <h1>{deliveryStatusMap[props?.status]}</h1>
          </DeliveryStatusBadge>
        </TxCardPharmacyName>

        <h2>
          {formattedDate} {orderTime}
        </h2>
        <h3>{props.invoice_number}</h3>
      </TxHeaders>

      {props?.cart_items?.map((product, index) => {
        if (index > 1) return null;
        // if (props?.cart_items?.length === 1) {
        //   return <FillerDiv key={`txProductCard${index}`} />;
        // }

        return (
          <TxProductBreakdown key={`txProductCard${index}`}>
            <Image
              src={product.thumbnail_url}
              alt={`txProductIMG${index}`}
              width={75}
              height={75}
              onClick={() => router.replace(`/products/${product.slug}`)}
            />

            <BreakdownCenterDiv>
              <h1>
                {product.name.charAt(0).toUpperCase()}
                {product.name.slice(1, product.name.length - 1)}
              </h1>
              <span>
                {product.quantity} unit x Rp.&nbsp;
                {product.price.toLocaleString('id-ID')} {product.selling_unit}
              </span>
              <span>
                {product.weight > 1000
                  ? `${product.weight / 1000} kg`
                  : `${product.weight} g`}
                &nbsp;
                {product.selling_unit}
              </span>
            </BreakdownCenterDiv>

            <SeparatorDiv />

            <BreakdownRightDiv>
              Total untuk produk ini:
              <span>
                Rp. {(product.price * product.quantity).toLocaleString('id-ID')}
              </span>
            </BreakdownRightDiv>
          </TxProductBreakdown>
        );
      })}

      <SeeMoreDiv onClick={props.handleOpenViewMore}>
        {props?.cart_items?.length < 2 ? (
          <h4>Lihat Detail Transaksi</h4>
        ) : (
          <h4>Lihat {props?.cart_items?.length - 2} produk lainnya</h4>
        )}
        <DotICO />
      </SeeMoreDiv>
    </TransactionCardContainer>
  );
};

export default TransactionCard;
