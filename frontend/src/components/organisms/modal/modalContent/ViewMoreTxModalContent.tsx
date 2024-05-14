import {
  BreakdownCenterDiv,
  BreakdownRightDiv,
  DeliveryStatusBadge,
  SeparatorDiv,
} from '@/styles/molecules/cards/TransactionCard.styles';
import {
  InfoDiv,
  InfoDivAlt,
  InfoDivAltLong,
  PaymentInfo,
  PharmacyInfo,
  ProductBreakdownContainer,
  ShippingInfo,
  TxProductBreakdownModal,
  ViewMoreHeaders,
  ViewMoreModalContainer,
} from '@/styles/organisms/modal/modalContent/ViewMoreModalContent.styles';
import { useObatinSelector } from '@/redux/store/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import moment from 'moment';
import { useState } from 'react';
import DownArrowICO from '@/assets/arrows/DownArrowICO';
import UpArrowICO from '@/assets/arrows/UpArrowICO';
moment.locale('id');

const ViewMoreTxModalContent = (): React.ReactElement => {
  const router = useRouter();
  const products = useObatinSelector((state) => state?.tx?.products);
  const info = useObatinSelector((state) => state?.tx?.info);
  const userInfo = useObatinSelector((state) => state?.auth);
  const splittedDate = info?.created_at?.split(' ')?.[0];
  const orderTime = info?.created_at?.split(' ')?.[1];
  const formattedDate = moment(splittedDate, 'DD-MM-YYYY').format(
    'dddd, Do MMMM YYYY',
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const multipleProducts = products.length !== 1;
  const userAddress =
    userInfo?.addresses !== undefined
      ? userInfo.addresses.find((address) => {
          return address.id === userInfo.activeAddressId;
        })
      : null;
  const fullUserAddress = `${userAddress?.detail?.charAt(0)?.toUpperCase()}${userAddress?.detail?.slice(1, userAddress?.detail?.length)}, ${userAddress?.city?.type} ${userAddress?.city?.name}, Provinsi ${userAddress?.city?.province?.name} ${userAddress?.city?.postal_code}`;
  const fullPrice =
    info.subtotal && info.shipping?.cost
      ? info.subtotal + info.shipping.cost
      : 0;

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
    <ViewMoreModalContainer>
      <ViewMoreHeaders>
        <DeliveryStatusBadge
          $isModal={true}
          $color={info.status ? deliveryStatusColorMap[info.status] : ''}
        >
          <h1>{info.status ? deliveryStatusMap[info.status] : ''}</h1>
        </DeliveryStatusBadge>
        <InfoDiv>
          <h2>No. Invoice</h2>
          <h4>{info.invoice_number}</h4>
        </InfoDiv>
        <InfoDiv>
          <h2>Tanggal & Waktu Pembelian</h2>
          <h3>
            {formattedDate} {orderTime}
          </h3>
        </InfoDiv>
      </ViewMoreHeaders>

      <ProductBreakdownContainer $isExpanded={isExpanded}>
        {products?.map((product, index) => {
          const isLastCard = products.length - 1 === index;
          return (
            <TxProductBreakdownModal
              key={`txProductCardDetailed${product.pharmacy_product_id}_${index}`}
              $isLastCard={isLastCard}
            >
              <Image
                src={product.thumbnail_url}
                alt={`txProductIMG${index}`}
                width={75}
                height={75}
                onClick={() => router.replace(`/products/${product.slug}`)}
              />

              <BreakdownCenterDiv $isModal={true}>
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

              <BreakdownRightDiv $isModal={true}>
                Total untuk produk ini:
                <span>
                  Rp.{' '}
                  {(product.price * product.quantity).toLocaleString('id-ID')}
                </span>
              </BreakdownRightDiv>
            </TxProductBreakdownModal>
          );
        })}
      </ProductBreakdownContainer>

      {multipleProducts && (
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <>
              Lihat Lebih Sedikit <UpArrowICO />
            </>
          ) : (
            <>
              Lihat Semua Barang <DownArrowICO />
            </>
          )}
        </button>
      )}

      <PharmacyInfo>
        <h1>Info Apotik</h1>
        <InfoDivAlt>
          <h2>Nama</h2>
          <span>:</span>
          <h3>{info?.pharmacy?.name}</h3>
        </InfoDivAlt>
        {userInfo.addresses && (
          <InfoDivAlt>
            <h2>Alamat Penerima</h2>
            <span>:</span>
            <p>{fullUserAddress}</p>
          </InfoDivAlt>
        )}
        <InfoDivAltLong>
          <h2>Alamat Apotik</h2>
          <span>:</span>
          <p>{info?.pharmacy?.address}</p>
        </InfoDivAltLong>
      </PharmacyInfo>

      <ShippingInfo>
        <h1>Info Pengiriman</h1>
        <InfoDivAlt>
          <h2>Kurir</h2>
          <span>:</span>
          <h3>{info.shipping?.name}</h3>
        </InfoDivAlt>
        <InfoDivAlt>
          <h2>Tipe Ekspedisi</h2>
          <span>:</span>
          <h3>{info.shipping?.type}</h3>
        </InfoDivAlt>
        {userInfo.addresses && (
          <InfoDivAlt>
            <h2>Alamat Pengiriman</h2>
            <span>:</span>
            <p>{fullUserAddress}</p>
          </InfoDivAlt>
        )}
      </ShippingInfo>

      <PaymentInfo>
        <h1>Rincian Pembayaran</h1>
        <InfoDivAlt>
          <h4>Metode Pembayaran</h4>
          <span>:</span>
          <h5>Transfer Bank</h5>
        </InfoDivAlt>
        <InfoDivAlt>
          <h4>Total Harga ({info.number_items} Barang)</h4>
          <span>:</span>
          <h5>Rp. {info.subtotal?.toLocaleString('id-ID')}</h5>
        </InfoDivAlt>
        <InfoDivAlt>
          <h4>Total Ongkos Kirim</h4>
          <span>:</span>
          <h5>Rp. {info.shipping?.cost?.toLocaleString('id-ID')}</h5>
        </InfoDivAlt>
        <InfoDivAlt>
          <h6>Total Belanja</h6>
          <span>:</span>
          <h5>Rp. {fullPrice?.toLocaleString('id-ID')}</h5>
        </InfoDivAlt>
      </PaymentInfo>
    </ViewMoreModalContainer>
  );
};

export default ViewMoreTxModalContent;
