'use client';
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
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useModal } from '@/hooks/useModal';
import { ModalType } from '@/types/modalTypes';
import Axios from 'axios';
import CustomButton from '@/components/atoms/button/CustomButton';

const PaymentSummaryComponent = (props: {
  isNext: boolean;
}): React.ReactElement => {
  const pharmacies = useObatinSelector((state) => state?.pharmacy.pharmacies);
  const pharmacyState = useObatinSelector((state) => state?.pharmacy);
  const accessToken = getCookie('access_token');
  const dispatch = useObatinDispatch();
  const { setToast } = useToast();
  const { openModal } = useModal();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const emitter = useEventEmitter();

  const triggerModal = async (type: ModalType) => {
    return new Promise<boolean>((resolve) => {
      openModal(type);

      emitter.once('close-modal-fail', () => {
        resolve(false);
      });

      emitter.once('close-modal-ok', () => {
        resolve(true);
      });
    });
  };

  const handleCheckout = async () => {
    try {
      let pharmacies_cart: Array<Partial<PharmacyCart>> = [];
      let unsetShippingProductsCount = 0;
      let atLeastOneShippingSet = false;
      pharmacies.map((pharmacy) => {
        if (!pharmacy.shipping_id) {
          pharmacy.cart_items.forEach((product) => {
            unsetShippingProductsCount += product.quantity;
          });
          localStorage.setItem(
            'unsetShipping',
            unsetShippingProductsCount.toString(),
          );
          return;
        }

        atLeastOneShippingSet = true;
        const {
          shipping_name,
          shipping_service,
          shipping_estimation,
          ...rest
        } = pharmacy;
        pharmacies_cart.push(rest);
      });

      if (!atLeastOneShippingSet) {
        setToast({
          showToast: true,
          toastMessage: 'Pilihlah metode pengiriman',
          toastType: 'warning',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      if (unsetShippingProductsCount > 0) {
        const canProceed = await triggerModal('unset-shipment');
        if (!canProceed) return;
      }

      let totalQuantity: number = 0;
      let totalCheckout: number = 0;
      let totalShippingCost: number = 0;
      pharmacies_cart.forEach((pharmacy) => {
        pharmacy.cart_items?.forEach((product) => {
          totalQuantity += product.quantity;
          totalCheckout += product.price * product.quantity;
        });
        totalShippingCost += pharmacy?.shipping_cost ?? 0;
      });
      localStorage.setItem(
        'checkout',
        `${totalQuantity},${totalCheckout},${totalShippingCost}`,
      );

      const canProceed = await triggerModal('confirm-checkout');
      if (!canProceed) return;

      const payload = {
        pharmacies_cart,
      };

      const response = await Axios.post(
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
            <p>Checkout</p>
            <p>{pharmacyState?.checkoutProductsQty} produk</p>
          </div>
          <div>
            <p>Harga Barang</p>
            <p>
              Rp. {pharmacyState?.checkoutSubtotal?.toLocaleString('id-ID')}
            </p>
          </div>
          <div>
            <p>Biaya Pengiriman</p>
            <p>
              Rp.&nbsp;
              {pharmacyState?.checkoutShipmentSubtotal?.toLocaleString('id-ID')}
            </p>
          </div>
        </PaymentSummary>
        <Summary>
          <div>
            <h3>Total Belanja</h3>
            <p>
              Rp.&nbsp;
              {(
                pharmacyState?.checkoutSubtotal +
                pharmacyState?.checkoutShipmentSubtotal
              )?.toLocaleString('id-ID')}
            </p>
          </div>
          {props.isNext && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
