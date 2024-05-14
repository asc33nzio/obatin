'use client';
import {
  PaymentSummary,
  PaymentSummaryContainer,
  Summary,
} from '@/styles/pages/product/Cart.styles';
import {
  PharmacyCart,
  resetPharmacyStates,
} from '@/redux/reducers/pharmacySlice';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { getCookie } from 'cookies-next';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useModal } from '@/hooks/useModal';
import { ModalType } from '@/types/modalTypes';
import { useRouter } from 'next/navigation';
import { clearCart, syncCartItem } from '@/redux/reducers/cartSlice';
import { encrypt } from '@/utils/crypto';
import { useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import { LoaderDiv } from '@/styles/pages/auth/Auth.styles';
import Axios from 'axios';
import CustomButton from '@/components/atoms/button/CustomButton';

const PaymentSummaryComponent = (): React.ReactElement => {
  const pharmacies = useObatinSelector((state) => state?.pharmacy.pharmacies);
  const pharmacyState = useObatinSelector((state) => state?.pharmacy);
  const accessToken = getCookie('access_token');
  const { setToast } = useToast();
  const { openModal } = useModal();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const emitter = useEventEmitter();
  const router = useRouter();
  const dispatch = useObatinDispatch();

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
      setIsLoading(true);
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
          orientation: 'right',
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

      const checkoutResponse = await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/cart/checkout`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const { payment_id } = checkoutResponse.data.data;
      const encryptedPID = await encrypt(payment_id);
      const encodedEncryptedPID = encodeURIComponent(encryptedPID);

      dispatch(clearCart());
      const updatedCartResponse = await Axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/cart/details`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const newPharmaciesCart: Array<PharmacyCart> =
        updatedCartResponse.data.data.pharmacies_cart;
      newPharmaciesCart?.forEach((pharmacy) => {
        pharmacy?.cart_items?.forEach((cartItem) => {
          dispatch(
            syncCartItem({
              product_id: cartItem.product_id,
              prescription_id: cartItem.prescription_id ?? null,
              pharmacy_id: pharmacy.id ?? null,
              quantity: cartItem.quantity,
            }),
          );
        });
      });

      setToast({
        showToast: true,
        toastMessage: 'Silahkan melakukan pembayaran',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'right',
      });

      dispatch(resetPharmacyStates());
      router.replace(`/shop/checkout/${encodedEncryptedPID}`);
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, mohon coba kembali',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'right',
      });
    } finally {
      setIsLoading(false);
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

          {isLoading ? (
            <LoaderDiv style={{ marginLeft: '185px' }}>
              <PropagateLoader
                color='#dd1b50'
                speedMultiplier={0.8}
                size={'18px'}
                cssOverride={{
                  alignSelf: 'center',
                  justifySelf: 'center',
                }}
              />
            </LoaderDiv>
          ) : (
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
