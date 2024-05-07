import {
  ButtonAddContainer,
  DeliveryItem,
  Details,
  OngkosKirim,
  PharmacyName,
  ProductItem,
} from '@/styles/pages/product/Cart.styles';
import Image from 'next/image';
import React, { useState } from 'react';
import CustomButton from '../button/CustomButton';
import PharmacyICO from '@/assets/icons/PharmacyICO';
import DetailICO from '@/assets/icons/DetailICO';
import { Container } from '@/styles/Global.styles';
import DeleteICO from '@/assets/dashboard/DeleteICO';
import BikeICO from '@/assets/icons/BikeICO';
import { useModal } from '@/hooks/useModal';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { addItemToCart, removeItemFromCart } from '@/redux/reducers/cartSlice';
import { useRouter } from 'next/navigation';
import { ProductType } from '@/types/Product';

const ProductCartItem = () => {
  const { items } = useObatinSelector((state) => state.cart);
  const dispatch = useObatinDispatch();
  // eslint-disable-next-line
  const router = useRouter();
  // eslint-disable-next-line
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>();

  const handleRemoveItemCart = (id: number) => {
    dispatch(removeItemFromCart(id));
  };

  const handleAdd = (productId: number) => {
    // eslint-disable-next-line
    const existingItem = items.find((item) => item.id === productId);
    // dispatch(
    //   addItemToCart({
    //     ...existingItem,
    //     quantity: +1,
    //   }),
    // );
  };

  const handleSubtract = (productId: number) => {
    const existingItem = items.find((item) => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      dispatch(
        addItemToCart({
          ...existingItem,
          quantity: -1,
        }),
      );
    } else {
      dispatch(removeItemFromCart(productId));
      setSelectedProduct(null);
    }
  };

  const { openModal } = useModal();

  const openDetailPharmacyInterface = () => {
    openModal('detail-pharmacy');
  };

  // const handleProductClicked = (slug: string) => {
  //   router.push(`products/${slug}`);
  // };

  return (
    <>
      {items.map((item) => (
        <Container key={item.id}>
          <PharmacyName>
            <PharmacyICO />
            <p>Nama Apotek</p>
            <div onClick={() => openDetailPharmacyInterface()}>
              <DetailICO />
            </div>
          </PharmacyName>
          <ProductItem>
            <Image alt='image' src={item.image_url} width={100} height={100} />
            <Details>
              <h1>{item.name}</h1>
              <p>400</p>
              <p>Rp{item.price}</p>
            </Details>
            <ButtonAddContainer>
              <CustomButton
                content='-'
                $width='40px'
                $height='40px'
                $border='#00B5C0'
                onClick={() => handleSubtract(item.id)}
              />
              <p>{item.quantity}</p>
              <CustomButton
                content='+'
                $width='40px'
                $height='40px'
                $border='#00B5C0'
                onClick={() => handleAdd(item.id)}
              />
              <DeleteICO onClick={() => handleRemoveItemCart(item.id)} />
            </ButtonAddContainer>
          </ProductItem>
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
