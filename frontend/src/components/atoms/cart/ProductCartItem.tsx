import { useModal } from '@/hooks/useModal';
import {
  PharmacyCart,
  setPharmacies,
  setSelectedPharmacy,
} from '@/redux/reducers/pharmacySlice';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import {
  CartItem,
  addItemToCart,
  removeItemFromCart,
} from '@/redux/reducers/cartSlice';
import Image from 'next/image';
import React, { useEffect } from 'react';
import CustomButton from '../button/CustomButton';
import PharmacyICO from '@/assets/icons/PharmacyICO';
import DetailICO from '@/assets/icons/DetailICO';
import DeleteICO from '@/assets/dashboard/DeleteICO';
import BikeICO from '@/assets/icons/BikeICO';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import {
  ButtonAddContainer,
  CartItemContainer,
  DeliveryItem,
  Details,
  OngkosKirim,
  PharmacyName,
  ProductItem,
} from '@/styles/pages/product/Cart.styles';

const ProductCartItem = () => {
  const dispatch = useObatinDispatch();
  const accessToken = getCookie('access_token');
  const pharmacies = useObatinSelector((state) => state?.pharmacy?.pharmacies);
  const { items } = useObatinSelector((state) => state?.cart);
  const { openModal } = useModal();
  const selectedPharmacy = useObatinSelector(
    (state) => state?.pharmacy?.selectedPharmacy,
  );

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/cart/details`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const pharmaciesCart = response.data.data;
        dispatch(setPharmacies({ pharmacies: pharmaciesCart }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchCartItems();
    //eslint-disable-next-line
  }, []);

  const deleteFromCart = async (id: number, product_id: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/cart/item`,
        {
          data: {
            id: id,
            product_id: product_id,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(
        removeItemFromCart({
          product_id,
        }),
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleAddToCart = (product_id: number) => {
    const existingItem = items.find((item) => item.product_id === product_id);
    if (existingItem) {
      dispatch(
        addItemToCart({
          ...existingItem,
          quantity: existingItem.quantity + 1,
        }),
      );
    } else {
      dispatch(
        addItemToCart({
          product_id: product_id,
          prescription_id: null,
          pharmacy_id: null,
          quantity: 1,
        }),
      );
    }
  };

  const handleSubtract = (productId: Partial<CartItem>) => {
    const existingItem = items.find((item) => item.product_id === productId);
    if (existingItem && existingItem.quantity > 1) {
      dispatch(
        removeItemFromCart({
          ...existingItem,
          quantity: existingItem.quantity - 1,
        }),
      );
    } else {
      dispatch(removeItemFromCart(productId));
    }
  };

  const openDetailPharmacyInterface = () => {
    openModal('detail-pharmacy');
  };

  const openAddShippingInterface = (pharmacy: PharmacyCart) => {
    dispatch(setSelectedPharmacy(pharmacy));
    openModal('add-shipping');
  };

  return (
    pharmacies && (
      <>
        {pharmacies['pharmacies_cart']?.map((pharmacy: PharmacyCart) => (
          <CartItemContainer key={pharmacy.id}>
            <PharmacyName>
              <PharmacyICO />
              <p>{pharmacy.name}</p>
              <DetailICO onClick={() => openDetailPharmacyInterface()} />
            </PharmacyName>
            {pharmacy.cart_items.map((item) => (
              <ProductItem key={`productItem${item?.id}`}>
                <Image
                  alt='image'
                  src={item.thumbnail_url}
                  width={100}
                  height={100}
                />
                <Details>
                  <h1>{item?.name}</h1>
                  <p>stock: {item?.stock}</p>
                  <p>Rp{item?.price}</p>
                </Details>
                <ButtonAddContainer>
                  <CustomButton
                    content='-'
                    $width='40px'
                    $height='40px'
                    $border='#00B5C0'
                    onClick={() => handleSubtract(item?.id)}
                  />
                  <p>{item.quantity}</p>
                  <CustomButton
                    content='+'
                    $width='40px'
                    $height='40px'
                    $border='#00B5C0'
                    onClick={() => handleAddToCart(item.id)}
                  />
                  <DeleteICO
                    onClick={() => deleteFromCart(item.id, item.product_id)}
                  />
                </ButtonAddContainer>
              </ProductItem>
            ))}

            <DeliveryItem onClick={() => openAddShippingInterface(pharmacy)}>
              <div>
                <BikeICO />
                <div>
                  <h3>Opsi Pengiriman</h3>
                  <p>{selectedPharmacy?.shipping_id}</p>
                  <p>{selectedPharmacy?.shipping_name}</p>
                </div>
              </div>
              <OngkosKirim>
                <p>Rp{selectedPharmacy?.shipping_cost?.toLocaleString()}</p>
              </OngkosKirim>
            </DeliveryItem>
          </CartItemContainer>
        ))}
      </>
    )
  );
};

export default ProductCartItem;
