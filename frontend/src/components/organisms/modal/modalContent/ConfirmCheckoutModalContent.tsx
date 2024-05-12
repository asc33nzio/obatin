import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import CustomButton from '@/components/atoms/button/CustomButton';
import styled from 'styled-components';

export const ConfirmCheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: start;

  width: 100%;
  height: 100%;
`;

const UnsetShippingModalButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  align-items: center;
  justify-content: space-between;

  width: 50%;
  height: 50px;

  margin-top: 25px;
`;

const ConfirmCheckoutModalContent = (): React.ReactElement => {
  const emitter = useEventEmitter();
  const { setToast } = useToast();
  const { closeModal } = useModal();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const checkoutBreakdown = localStorage.getItem('checkout');

  const totalQuantity = checkoutBreakdown?.split(',')?.[0];
  const totalShippingCost = parseInt(checkoutBreakdown?.split(',')?.[1]!, 10);
  const totalCheckout = parseInt(checkoutBreakdown?.split(',')?.[2]!, 10);

  return (
    <ConfirmCheckoutContainer>
      <div>
        <p>Checkout</p>
        <p>{totalQuantity} produk</p>
      </div>
      <div>
        <h3>Harge Produk</h3>
        <p>Rp. {totalCheckout?.toLocaleString('id-ID')}</p>
      </div>
      <div>
        <p>Biaya Pengiriman</p>
        <p>Rp. {totalShippingCost?.toLocaleString('id-ID')}</p>
      </div>
      <div>
        <p>Total Belanja</p>
        <p>Rp. {(totalCheckout + totalShippingCost).toLocaleString('id-ID')}</p>
      </div>

      <UnsetShippingModalButtonsContainer>
        <CustomButton
          content='Batal'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          $bgColor='#de161c'
          onClick={() => {
            localStorage.removeItem('checkout');
            emitter.emit('close-modal-fail');
            closeModal();

            setToast({
              showToast: true,
              toastMessage: 'Silahkan lanjut untuk memilih metode pengiriman',
              toastType: 'warning',
              resolution: isDesktopDisplay ? 'desktop' : 'mobile',
              orientation: 'center',
            });
          }}
        />
        <CustomButton
          content='Lanjutkan'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          onClick={() => {
            localStorage.removeItem('checkout');
            emitter.emit('close-modal-ok');
            closeModal();
          }}
        />
      </UnsetShippingModalButtonsContainer>
    </ConfirmCheckoutContainer>
  );
};

export default ConfirmCheckoutModalContent;
