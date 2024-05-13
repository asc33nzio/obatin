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
  deduceByOne,
  increaseByOne,
  removeItemFromPharmacyCart,
  setPharmacies,
  setSelectedPharmacy,
} from '@/redux/reducers/pharmacySlice';
import {
  removeItemFromCart,
  deduceOneFromCart,
  increaseOneToCart,
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

const CartProductCard = () => {
  const dispatch = useObatinDispatch();
  const accessToken = getCookie('access_token');
  const pharmacies = useObatinSelector((state) => state?.pharmacy?.pharmacies);
  const items = useObatinSelector((state) => state?.cart?.items);
  const { openModal } = useModal();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const response = await Axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/cart/details`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const { pharmacies_cart } = response.data.data;
      if (pharmacies_cart.length > 0) dispatch(setPharmacies(pharmacies_cart));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemDb = async (product_id: number, quantity: number) => {
    const payload = {
      product_id,
      prescription_id: null,
      pharmacy_id: null,
      quantity,
    };

    try {
      setIsLoading(true);
      await Axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/cart`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error: any) {
      console.log(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, telah terjadi kesalahan, mohon coba kembali',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCartDelete = async (
    cart_id: number,
    product_id: number,
    pharmacy_id: number,
    name: string,
  ) => {
    const payload = {
      id: cart_id,
      product_id,
    };

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
      dispatch(
        removeItemFromPharmacyCart({
          product_id,
          pharmacy_id,
        }),
      );
      dispatch(removeItemFromCart(existingItem));
      setShouldUpdate(!shouldUpdate);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleIncrease = async (product_id: number, pharmacy: PharmacyCart) => {
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

    dispatch(increaseOneToCart(existingItem.product_id));
    dispatch(increaseByOne(product_id));

    await updateCartItemDb(product_id, existingItem.quantity + 1);
  };

  const handleSubtract = async (
    product_id: number,
    pharmacy: PharmacyCart,
    cart_id: number,
    name: string,
  ) => {
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

    dispatch(deduceOneFromCart(existingItem));
    dispatch(deduceByOne(product_id));

    await updateCartItemDb(product_id, existingItem.quantity - 1);
    if (existingItem.quantity === 1) {
      await handleCartDelete(cart_id, product_id, pharmacy.id, name);
    }
  };

  const openDetailPharmacyInterface = () => {
    //! todo: invoke invokable modal
  };

  const openAddShippingInterface = (pharmacy: PharmacyCart) => {
    dispatch(setSelectedPharmacy(pharmacy));
    openModal('add-shipping');
  };

  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldUpdate]);

  return (
    pharmacies.length !== 0 && (
      <>
        {pharmacies?.map((pharmacy: PharmacyCart, index) => {
          if (pharmacy.cart_items?.length === 0) return null;
          const realPharmaState = pharmacies.find(
            (pharma) => pharma.id === pharmacy.id,
          );

          const totalPrice = realPharmaState?.cart_items?.reduce(
            (total, product) => {
              return total + product.quantity * product.price;
            },
            0,
          );
          return (
            <CartItemContainer
              key={`cartCard${pharmacy.id}_${index}_${pharmacy.shipping_cost}`}
            >
              <PharmacyName>
                <div>
                  <PharmacyICO />
                  <p>
                    {pharmacy?.name?.charAt(0).toUpperCase()}
                    {pharmacy?.name?.slice(1, pharmacy.name.length)}
                  </p>
                  <DetailICO onClick={() => openDetailPharmacyInterface()} />
                </div>
                <p>Total : Rp. {totalPrice?.toLocaleString('id-ID')}</p>
              </PharmacyName>

              {pharmacy?.cart_items?.map((item, index) => (
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
                    <p>Rp. {item?.price?.toLocaleString('id-ID')}</p>
                  </Details>
                  <ButtonAddContainer>
                    <CustomButton
                      disabled={isLoading}
                      content='-'
                      $width='40px'
                      $height='40px'
                      $border='#00B5C0'
                      onClick={() =>
                        handleSubtract(
                          item.product_id,
                          pharmacy,
                          item.id,
                          item.name,
                        )
                      }
                    />
                    <p>{item.quantity}</p>
                    <CustomButton
                      disabled={isLoading}
                      content='+'
                      $width='40px'
                      $height='40px'
                      $border='#00B5C0'
                      onClick={() => handleIncrease(item.product_id, pharmacy)}
                    />
                    <DeleteICO
                      onClick={() =>
                        handleCartDelete(
                          item.id,
                          item.product_id,
                          pharmacy.id,
                          item.name,
                        )
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
                    <div>
                      <p>Kurir</p>
                      <p>:</p>
                      <p>{realPharmaState?.shipping_name ?? '-'}</p>
                    </div>
                    <div>
                      <p>Servis</p>
                      <p>:</p>
                      <p>{realPharmaState?.shipping_service ?? '-'}</p>
                    </div>
                    <div>
                      <p>Estimasi</p>
                      <p>:</p>
                      <p>{realPharmaState?.shipping_estimation ?? '-'}</p>
                    </div>
                  </div>
                </div>
                <OngkosKirim>
                  <p>
                    Rp.{' '}
                    {realPharmaState?.shipping_cost?.toLocaleString('id-ID') ??
                      `0`}
                  </p>
                </OngkosKirim>
              </DeliveryItem>
            </CartItemContainer>
          );
        })}
      </>
    )
  );
};

export default CartProductCard;
