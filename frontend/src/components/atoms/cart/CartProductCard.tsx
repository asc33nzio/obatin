/* eslint-disable react-hooks/exhaustive-deps */
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
import { ClipLoader, PuffLoader } from 'react-spinners';
import { LoaderDiv } from '@/styles/pages/auth/Auth.styles';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CustomButton from '../button/CustomButton';
import PharmacyICO from '@/assets/icons/PharmacyICO';
import DetailICO from '@/assets/icons/DetailICO';
import DeleteICO from '@/assets/dashboard/DeleteICO';
import BikeICO from '@/assets/icons/BikeICO';
import Axios from 'axios';
import InvokableModal from '@/components/organisms/modal/InvokableModal';
import WarningICO from '@/assets/icons/WarningICO';

const CartProductCard = () => {
  const userInfo = useObatinSelector((state) => state?.auth);
  const dispatch = useObatinDispatch();
  const accessToken = getCookie('access_token');
  const pharmacies = useObatinSelector((state) => state?.pharmacy?.pharmacies);
  const items = useObatinSelector((state) => state?.cart?.items);
  const { openModal } = useModal();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isFetchingStock, setIsFetchingStock] = useState<boolean>(false);
  const [hasFetchedStock, setHasFetchedStock] = useState<boolean>(false);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  const [selectedPharmacyDetail, setSelectedPharmacyDetail] =
    useState<PharmacyCart | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [partnerStockData, setPartnerStockData] = useState<{
    [key: number]: number;
  }>({});

  const fetchCartItems = async () => {
    try {
      setIsFetching(true);
      const response = await Axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/cart/details`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const { pharmacies_cart } = response.data.data;
      dispatch(setPharmacies(pharmacies_cart));
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchTotalStockForOneProduct = async (
    product_id: number,
    partner_id: number,
  ) => {
    try {
      const response = await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/products/total-stock`,
        {
          product_id,
          partner_id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data.data.total_stock;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchAllStock = async (pharmacies_cart: PharmacyCart[]) => {
    setIsFetchingStock(true);
    const stockPromises = pharmacies_cart.flatMap((pharmacy) =>
      pharmacy.cart_items.map((item) =>
        fetchTotalStockForOneProduct(item.product_id, pharmacy.partner_id).then(
          (total_stock) => ({
            product_id: item.product_id,
            total_stock,
          }),
        ),
      ),
    );

    const stockResults = await Promise.all(stockPromises);
    const stockMap = stockResults.reduce((acc, { product_id, total_stock }) => {
      acc[product_id] = total_stock;
      return acc;
    }, {});

    setPartnerStockData(stockMap);
    setIsFetchingStock(false);
    setHasFetchedStock(true);
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
      console.error(error);
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

  const handlePharmacyDetailOpen = (pharmacy: PharmacyCart) => {
    setSelectedPharmacyDetail(pharmacy);
    setIsModalOpen(true);
  };

  const handlePharmacyDetailClose = () => {
    setSelectedPharmacyDetail(null);
    setIsModalOpen(false);
  };

  const openAddShippingInterface = (
    pharmacy: PharmacyCart,
    isOverweight: boolean,
  ) => {
    if (isOverweight) {
      setToast({
        showToast: true,
        toastMessage:
          'Maaf, pembelanjaan anda terlalu berat. Total berat tidak boleh melebihi 30kg',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    dispatch(setSelectedPharmacy(pharmacy));
    openModal('add-shipping');
  };

  useEffect(() => {
    fetchCartItems();
  }, [shouldUpdate, userInfo?.activeAddressId]);

  useEffect(() => {
    if (pharmacies.length > 0 && !isFetching && !hasFetchedStock) {
      fetchAllStock(pharmacies);
    }
  }, [pharmacies, isFetching, hasFetchedStock]);

  return pharmacies.length !== 0 && !isFetching ? (
    <>
      {pharmacies?.map((pharmacy: PharmacyCart, index) => {
        if (pharmacy.cart_items?.length === 0) return null;
        const realPharmaState = pharmacies.find(
          (pharma) => pharma.id === pharmacy.id,
        );

        const nearbyPharmaNotFound = realPharmaState?.name === null;

        const totalPrice = realPharmaState?.cart_items?.reduce(
          (total, product) => {
            return total + product.quantity * product.price;
          },
          0,
        );

        const totalWeight = realPharmaState?.cart_items?.reduce(
          (total, product) => {
            return total + product.quantity * product.weight;
          },
          0,
        );
        const isOverweight = totalWeight >= 29998;

        return (
          <CartItemContainer
            key={`cartCard${pharmacy.id}_${index}_${pharmacy.shipping_cost}`}
            $isNotAvailable={nearbyPharmaNotFound}
            $isOverweight={isOverweight}
          >
            <PharmacyName>
              <div>
                {nearbyPharmaNotFound || isOverweight ? (
                  <WarningICO />
                ) : (
                  <PharmacyICO />
                )}
                {nearbyPharmaNotFound ? (
                  <div
                    style={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      gap: '1px',
                    }}
                  >
                    <p style={{ fontWeight: '660' }}>PRODUK TIDAK TERSEDIA</p>
                    <p style={{ fontSize: '12px' }}>
                      Maaf, tidak ada apotik dekat kamu yang menyediakan barang
                      ini
                    </p>
                    <p style={{ fontSize: '12px', fontWeight: '550' }}>
                      Mohon untuk mengeluarkan barang dari keranjang atau
                    </p>
                    <p style={{ fontSize: '12px', fontWeight: '550' }}>
                      atau menggati alamat pengiriman
                    </p>
                  </div>
                ) : (
                  <p>
                    {pharmacy?.name?.charAt(0).toUpperCase()}
                    {pharmacy?.name?.slice(1, pharmacy.name.length)}
                  </p>
                )}

                {!nearbyPharmaNotFound && (
                  <DetailICO
                    onClick={() => handlePharmacyDetailOpen(pharmacy)}
                  />
                )}
              </div>
              <p>Total : Rp. {totalPrice?.toLocaleString('id-ID')}</p>
            </PharmacyName>

            {pharmacy?.cart_items?.map((item, index) => {
              const partnerTotalStock =
                partnerStockData[item.product_id] ?? 'Tidak Tersedia';

              return (
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
                    <div>
                      <span>Stok</span>
                      <p>:</p>
                      <p>
                        {!isFetchingStock ? (
                          partnerTotalStock
                        ) : (
                          <ClipLoader
                            size={20}
                            loading={isFetchingStock}
                            speedMultiplier={0.75}
                            color='#00b5c0'
                          />
                        )}
                      </p>
                    </div>
                    <div>
                      <span>Berat</span>
                      <p>:</p>
                      <p>{(item?.weight / 1000).toFixed(3)} kg</p>
                    </div>
                    <div>
                      <span>Harga</span>
                      <p>:</p>
                      <p>Rp. {item?.price?.toLocaleString('id-ID')}</p>
                    </div>
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
                      disabled={isLoading || nearbyPharmaNotFound}
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
              );
            })}

            {!nearbyPharmaNotFound && (
              <DeliveryItem
                onClick={() => openAddShippingInterface(pharmacy, isOverweight)}
              >
                <div>
                  <BikeICO />
                  <div>
                    <h3>Opsi Pengiriman</h3>
                    <div>
                      <h2>Total Berat</h2>
                      <p>:</p>
                      <p>{(totalWeight / 1000).toFixed(3)} kg</p>
                    </div>
                    <div>
                      <h2>Kurir</h2>
                      <p>:</p>
                      <p>{realPharmaState?.shipping_name ?? '-'}</p>
                    </div>
                    <div>
                      <h2>Servis</h2>
                      <p>:</p>
                      <p>{realPharmaState?.shipping_service ?? '-'}</p>
                    </div>
                    <div>
                      <h2>Estimasi</h2>
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
            )}
          </CartItemContainer>
        );
      })}
      <InvokableModal
        $pharmacyDetail={{
          id: selectedPharmacyDetail?.id,
          name: selectedPharmacyDetail?.name,
          address: selectedPharmacyDetail?.address,
          distance: selectedPharmacyDetail?.distance,
          pharmacist_name: selectedPharmacyDetail?.pharmacist_name,
          pharmacist_phone: selectedPharmacyDetail?.pharmacist_phone,
          pharmacist_license: selectedPharmacyDetail?.pharmacist_license,
          operational_days: selectedPharmacyDetail?.operational_days,
          opening_time: selectedPharmacyDetail?.opening_time,
          closing_time: selectedPharmacyDetail?.closing_time,
        }}
        modalType='pharmacy-detail'
        $onOpen={handlePharmacyDetailOpen}
        $isOpen={isModalOpen}
        $onClose={handlePharmacyDetailClose}
      />
    </>
  ) : isFetching ? (
    <LoaderDiv style={{ marginTop: '50px', marginBottom: '25px' }}>
      <PuffLoader size={100} loading={isFetching} color='#00b5c0' />
    </LoaderDiv>
  ) : null;
};

export default CartProductCard;
