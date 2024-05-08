import {
  ButtonAddContainer,
  DeliveryItem,
  Details,
  OngkosKirim,
  PharmacyName,
  ProductItem,
} from '@/styles/pages/product/Cart.styles';
import { Container } from '@/styles/Global.styles';
import { useModal } from '@/hooks/useModal';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { addItemToCart, removeItemFromCart } from '@/redux/reducers/cartSlice';
import Image from 'next/image';
import React from 'react';
import CustomButton from '../button/CustomButton';
import PharmacyICO from '@/assets/icons/PharmacyICO';
import DetailICO from '@/assets/icons/DetailICO';
import DeleteICO from '@/assets/dashboard/DeleteICO';
import BikeICO from '@/assets/icons/BikeICO';

const ProductCartItem = () => {
  const dispatch = useObatinDispatch();
  const { pharmacies } = useObatinSelector((state) => state?.pharmacy);
  const { items } = useObatinSelector((state) => state?.cart);
  const products = useObatinSelector((state) => state?.cart?.product);

  const { openModal } = useModal();

  const handleRemoveItemCart = (id: number) => {
    dispatch(removeItemFromCart(id));
  };

  const handleAdd = (productId: number | undefined) => {
    const existingItem = items.find((item) => item.product_id === productId);
    if (existingItem) {
      dispatch(
        addItemToCart({
          ...existingItem,
          quantity: +1,
        }),
      );
    }
  };

  const handleSubtract = (productId: number) => {
    const existingItem = items.find((item: any) => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      dispatch(
        addItemToCart({
          ...existingItem,
          quantity: -1,
        }),
      );
    } else {
      dispatch(removeItemFromCart(productId));
    }
  };

  const openDetailPharmacyInterface = () => {
    openModal('detail-pharmacy');
  };

  return (
    <>
      {pharmacies.map((pharmacy) => (
        <Container key={pharmacy.id}>
          <PharmacyName>
            <PharmacyICO />
            <p>{pharmacy.name}</p>
            <DetailICO onClick={() => openDetailPharmacyInterface} />
          </PharmacyName>
          {items.map((item) => {
            const productInfo = products.find(
              (product) => product.id === item.product_id,
            );
            return (
              <ProductItem key={`productItem${productInfo?.id}`}>
                <Image alt='image' src='image' width={100} height={100} />
                <Details>
                  <h1>{productInfo?.name}</h1>
                  <p>400</p>
                  <p>{productInfo?.price}</p>
                </Details>
                <ButtonAddContainer>
                  <CustomButton
                    content='-'
                    $width='40px'
                    $height='40px'
                    $border='#00B5C0'
                    onClick={() => handleSubtract(item.product_id)}
                  />
                  <p>{item.quantity}</p>
                  <CustomButton
                    content='+'
                    $width='40px'
                    $height='40px'
                    $border='#00B5C0'
                    onClick={() => handleAdd(item.product_id)}
                  />
                  <DeleteICO
                    onClick={() => handleRemoveItemCart(item.product_id)}
                  />
                </ButtonAddContainer>
              </ProductItem>
            );
          })}

          <DeliveryItem>
            <div>
              <BikeICO />
              <div>
                <h3>Opsi Pengiriman</h3>
                <p>Opsi Pengiriman</p>
              </div>
            </div>
            <OngkosKirim>
              <p>Rp20.000</p>
            </OngkosKirim>
          </DeliveryItem>
        </Container>
      ))}
    </>
  );
};

export default ProductCartItem;
