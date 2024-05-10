import {
  PaymentSummary,
  PaymentSummaryContainer,
  Summary,
} from '@/styles/pages/product/Cart.styles';
import { navigateToCheckout } from '@/app/actions';
import { updateQuantityCart } from '@/redux/reducers/cartSlice';
import { setPaymentId } from '@/redux/reducers/pharmacySlice';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { getCookie } from 'cookies-next';
import CustomButton from '@/components/atoms/button/CustomButton';
import axios from 'axios';
import React from 'react';

const PaymentSummaryComponent = (props: {
  isNext: boolean;
}): React.ReactElement => {
  const selectedPharmacy = useObatinSelector(
    (state) => state?.pharmacy?.selectedPharmacy,
  );
  const totalQuantity = useObatinSelector((state) => state.cart.totalQuantity);
  const totalPrice = useObatinSelector((state) => state.cart.totalPrice);
  const shippingCost = selectedPharmacy?.shipping_cost || 0;
  const totalShoppingCost = totalPrice + shippingCost;
  const accessToken = getCookie('access_token');
  const dispatch = useObatinDispatch();

  const postCheckout = async () => {
    try {
      if (selectedPharmacy) {
        const payload = {
          pharmacies_cart: [
            {
              id: selectedPharmacy.id,
              name: selectedPharmacy.name,
              address: selectedPharmacy.address,
              city_id: selectedPharmacy.city_id,
              lat: selectedPharmacy.lat,
              lng: selectedPharmacy.lng,
              pharmacist_name: selectedPharmacy.pharmacist_name,
              pharmacist_license: selectedPharmacy.pharmacist_license,
              pharmacist_phone: selectedPharmacy.pharmacist_phone,
              opening_time: selectedPharmacy.opening_time,
              closing_time: selectedPharmacy.closing_time,
              operational_days: selectedPharmacy.operational_days,
              partner_id: selectedPharmacy.partner_id,
              distance: selectedPharmacy.distance,
              total_weight: selectedPharmacy.total_weight,
              subtotal_pharmacy: selectedPharmacy.subtotal_pharmacy,
              shipping_id: selectedPharmacy.shipping_id,
              shipping_cost: selectedPharmacy.shipping_cost,
              cart_items: selectedPharmacy.cart_items,
            },
          ],
        };

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
        dispatch(updateQuantityCart);
        navigateToCheckout();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransactionClick = async () => {
    try {
      await postCheckout();
    } catch (error) {
      console.log(error);
    }
  };

  // const handleCheckout = async () => {
  // dispatch(clearCart()) saat tidak ada error di post req
  // }

  return (
    <>
      <PaymentSummaryContainer>
        <PaymentSummary>
          <div>
            <p>Keranjang</p>
            <p>{totalQuantity} item(s)</p>
          </div>
          <div>
            <p>Biaya Pengiriman</p>
            <p>{shippingCost}</p>
          </div>
          <div>
            <p>Biaya Aplikasi</p>
            <p></p>
          </div>
        </PaymentSummary>
        <Summary>
          <div>
            <h3>Total Belanja</h3>
            <p>{totalShoppingCost}</p>
          </div>
          {props.isNext && (
            <div>
              <CustomButton
                content='Proses Transaksi'
                $width='250px'
                $height='50px'
                $fontSize='16px'
                onClick={() => handleTransactionClick()}
              />
            </div>
          )}
        </Summary>
      </PaymentSummaryContainer>
    </>
  );
};

export default PaymentSummaryComponent;
