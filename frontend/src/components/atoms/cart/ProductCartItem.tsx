import {
  ButtonAddContainer,
  CartItemContainer,
  DeliveryItem,
  Details,
  OngkosKirim,
  PharmacyName,
  ProductItem,
} from '@/styles/pages/product/Cart.styles';
import {
  PharmacyCart,
  // clearSelectedPharmacy,
  deduceByOne,
  increaseByOne,
  removeItemFromPharmacyCart,
  setPharmacies,
  setSelectedPharmacy,
} from '@/redux/reducers/pharmacySlice';
import {
  addItemToCart,
  removeItemFromCart,
  deduceOneFromCart,
  // clearCart,
} from '@/redux/reducers/cartSlice';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { useModal } from '@/hooks/useModal';
import { getCookie } from 'cookies-next';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import CustomButton from '../button/CustomButton';
import PharmacyICO from '@/assets/icons/PharmacyICO';
import DetailICO from '@/assets/icons/DetailICO';
import DeleteICO from '@/assets/dashboard/DeleteICO';
import BikeICO from '@/assets/icons/BikeICO';
import Axios from 'axios';

const ProductCartItem = () => {
  const dispatch = useObatinDispatch();
  const accessToken = getCookie('access_token');
  const pharmaciesState = useObatinSelector((state) => state?.pharmacy);
  const pharmacies = useObatinSelector((state) => state?.pharmacy?.pharmacies);
  const items = useObatinSelector((state) => state?.cart?.items);
  const { openModal } = useModal();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const selectedPharmacy = useObatinSelector(
    (state) => state?.pharmacy?.selectedPharmacy,
  );

  const fetchCartItems = async () => {
    try {
      const response = await Axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/cart/details`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const pharmaciesCart = response.data.data.pharmacies_cart;
      dispatch(
        setPharmacies({ ...pharmaciesState, pharmacies: pharmaciesCart }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldUpdate]);

  const handleCartDelete = async (
    id: number,
    product_id: number,
    name: string,
  ) => {
    const payload = {
      id,
      product_id,
    };

    // dispatch(clearCart());
    // dispatch(clearSelectedPharmacy());

    try {
      await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/cart/item`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const existingItem = items.find((item) => item.product_id === product_id);
      if (!existingItem) {
        setToast({
          showToast: true,
          toastMessage: 'Maaf, tolong coba kembali',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      setToast({
        showToast: true,
        toastMessage: `${name} dikeluarkan dari keranjang`,
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      dispatch(removeItemFromPharmacyCart(product_id));
      dispatch(removeItemFromCart(existingItem));
      setShouldUpdate(!shouldUpdate);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleAddToCart = (product_id: number, pharmacy: PharmacyCart) => {
    dispatch(setSelectedPharmacy(pharmacy));
    dispatch(addItemToCart(product_id));
    dispatch(increaseByOne(product_id));
    // dispatch(clearSelectedPharmacy());
  };

  const handleSubtract = (product_id: number, pharmacy: PharmacyCart) => {
    dispatch(setSelectedPharmacy(pharmacy));
    const existingItem = items.find((item) => item.product_id === product_id);

    if (existingItem === undefined) {
      setToast({
        showToast: true,
        toastMessage: 'Maaf, tolong coba kembali',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    // console.log(pharmacies);
    // console.log(product_id);
    // console.log(pharmacy.cart_items);

    dispatch(deduceOneFromCart(existingItem));
    dispatch(deduceByOne(product_id));
    // dispatch(clearSelectedPharmacy());
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
        {pharmacies?.map((pharmacy: PharmacyCart, index) => (
          <CartItemContainer
            key={`cartCard${pharmacy.id}_${index}_${pharmacy.shipping_cost}`}
          >
            <PharmacyName>
              <PharmacyICO />
              <p>{pharmacy.name}</p>
              <DetailICO onClick={() => openDetailPharmacyInterface()} />
            </PharmacyName>

            {pharmacy.cart_items.map((item, index) => (
              <ProductItem
                key={`cartProductItem${item?.id}_${index}_${item.pharmacy_product_id}`}
              >
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
                    onClick={() => handleSubtract(item.product_id, pharmacy)}
                  />
                  <p>{item.quantity}</p>
                  <CustomButton
                    content='+'
                    $width='40px'
                    $height='40px'
                    $border='#00B5C0'
                    onClick={() => handleAddToCart(item.product_id, pharmacy)}
                  />
                  <DeleteICO
                    onClick={() =>
                      handleCartDelete(item.id, item.product_id, item.name)
                    }
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
