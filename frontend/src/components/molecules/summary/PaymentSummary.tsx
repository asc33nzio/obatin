import {
  PaymentSummary,
  PaymentSummaryContainer,
  Summary,
} from '@/styles/pages/product/Cart.styles';
import { navigateToCheckout } from '@/app/actions';
import { PharmacyCart, setPaymentId } from '@/redux/reducers/pharmacySlice';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { getCookie } from 'cookies-next';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import CustomButton from '@/components/atoms/button/CustomButton';
import axios from 'axios';

const PaymentSummaryComponent = (props: {
  isNext: boolean;
}): React.ReactElement => {
  const pharmacies = useObatinSelector((state) => state?.pharmacy.pharmacies);
  const totalQuantity = useObatinSelector((state) => state.cart.totalQuantity);
  // const totalPrice = useObatinSelector((state) => state.cart.totalPrice);
  // const totalShoppingCost = totalPrice + shippingCost;
  const accessToken = getCookie('access_token');
  const dispatch = useObatinDispatch();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();

  const handleCheckout = async () => {
    try {
      // if (!selectedPharmacy) {
      //   setToast({
      //     showToast: true,
      //     toastMessage: 'Pilihlah metode pengiriman',
      //     toastType: 'warning',
      //     resolution: isDesktopDisplay ? 'desktop' : 'mobile',
      //     orientation: 'center',
      //   });
      //   return;
      // }

      const pharmaciesArr: Array<PharmacyCart> = [];
      pharmacies.map((pharmacy) => pharmaciesArr.push(pharmacy));

      const payload = {
        pharmacies_cart: pharmaciesArr,
      };

      console.log(payload);

      // {
      //   id: selectedPharmacy.id,
      //   name: selectedPharmacy.name,
      //   address: selectedPharmacy.address,
      //   city_id: selectedPharmacy.city_id,
      //   lat: selectedPharmacy.lat,
      //   lng: selectedPharmacy.lng,
      //   pharmacist_name: selectedPharmacy.pharmacist_name,
      //   pharmacist_license: selectedPharmacy.pharmacist_license,
      //   pharmacist_phone: selectedPharmacy.pharmacist_phone,
      //   opening_time: selectedPharmacy.opening_time,
      //   closing_time: selectedPharmacy.closing_time,
      //   operational_days: selectedPharmacy.operational_days,
      //   partner_id: selectedPharmacy.partner_id,
      //   distance: selectedPharmacy.distance,
      //   total_weight: selectedPharmacy.total_weight,
      //   subtotal_pharmacy: selectedPharmacy.subtotal_pharmacy,
      //   shipping_id: selectedPharmacy.shipping_id,
      //   shipping_cost: selectedPharmacy.shipping_cost,
      //   cart_items: selectedPharmacy.cart_items,
      // },

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/cart/checkout`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const { payment_id } = response.data.data;
      dispatch(setPaymentId(payment_id));
      navigateToCheckout();
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, mohon coba kembali',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  return (
    <>
      <PaymentSummaryContainer>
        <PaymentSummary>
          <div>
            <p>Keranjang</p>
            <p>{totalQuantity} item(s)</p>
          </div>
          <div>
            <p>Biaya Pengiriman XXX</p>
            {/* <p>{shippingCost}</p> */}
          </div>
          <div>
            <p>Biaya Aplikasi</p>
            <p></p>
          </div>
        </PaymentSummary>
        <Summary>
          <div>
            <h3>Total Belanja XXX</h3>
            {/* <p>{totalShoppingCost}</p> */}
          </div>
          {props.isNext && (
            <div>
              <CustomButton
                content='Proses Transaksi'
                $width='250px'
                $height='50px'
                $fontSize='16px'
                onClick={handleCheckout}
              />
            </div>
          )}
        </Summary>
      </PaymentSummaryContainer>
    </>
  );
};

export default PaymentSummaryComponent;
