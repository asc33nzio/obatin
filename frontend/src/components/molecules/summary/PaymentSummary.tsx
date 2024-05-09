import { navigateToCheckout } from '@/app/actions';
import { useObatinSelector } from '@/redux/store/store';
import {
  PaymentSummary,
  PaymentSummaryContainer,
  Summary,
} from '@/styles/pages/product/Cart.styles';
import CustomButton from '@/components/atoms/button/CustomButton';

const PaymentSummaryComponent = (props: {
  isNext: boolean;
}): React.ReactElement => {
  const { totalQuantity } = useObatinSelector((state) => state.cart);
  const { totalPrice } = useObatinSelector((state) => state.cart);

  // const handleCheckout = async () => {
  // dispatch(clearCart()) saat tidak ada error di post req
  // }

  return (
    <>
      <PaymentSummaryContainer>
        <PaymentSummary>
          <div>
            <p>Keranjang (4 items)</p>
            <p>{totalQuantity} item(s)</p>
          </div>
          <div>
            <p>Biaya Pengiriman</p>
            <p>Biaya Pengiriman</p>
          </div>
          <div>
            <p>Biaya Aplikasi</p>
            <p></p>
          </div>
        </PaymentSummary>
        <Summary>
          <div>
            <h3>Total Belanja</h3>
            <p>{totalPrice}</p>
          </div>
          {props.isNext && (
            <div>
              <CustomButton
                content='Lanjutkan Transaksi'
                $width='250px'
                $height='50px'
                $fontSize='16px'
                onClick={() => navigateToCheckout()}
              />
            </div>
          )}
        </Summary>
      </PaymentSummaryContainer>
    </>
  );
};

export default PaymentSummaryComponent;
