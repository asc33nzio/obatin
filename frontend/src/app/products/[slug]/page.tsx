'use client';
import {
  ButtonAdd,
  Buttoncontainer,
  Price,
  ProductDetail,
  ProductDetailContainer,
  SelectPharmacy,
} from '@/styles/pages/product/ProductDetail.styles';
import {
  increaseOneToCart,
  deduceOneFromCart,
} from '@/redux/reducers/cartSlice';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Body, Container } from '@/styles/Global.styles';
import { ProductType } from '@/types/Product';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { RingLoader } from 'react-spinners';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { navigateToChat } from '@/app/actions';
import { useToast } from '@/hooks/useToast';
import Axios from 'axios';
import Navbar from '@/components/organisms/navbar/Navbar';
import Footer from '@/components/organisms/footer/Footer';
import CustomButton from '@/components/atoms/button/CustomButton';
import Image from 'next/image';
import { PharmacyItf } from '@/types/pharmacyTypes';
import { PharmacyCart } from '@/redux/reducers/pharmacySlice';
import { getCookie } from 'cookies-next';
import { DialogModal } from '@/components/organisms/modal/dialogModal/DialogModal';

const ProductDetailPage = () => {
  const pathname = usePathname();
  const product_slug = pathname.split('/').pop();
  const [product, setProduct] = useState<ProductType | undefined>();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const { setToast } = useToast();
  const dispatch = useObatinDispatch();
  const items = useObatinSelector((state) => state.cart.items);
  const [isProductSelected, setIsProductSelected] =
    useState<ProductType | null>();
  // eslint-disable-next-line
  const [productId, setProductId] = useState<PharmacyItf | undefined>(
    undefined,
  );
  const [nearbyPharmacies, setNearbyPharmacies] = useState<PharmacyCart[]>([]);
  const userInfo = useObatinSelector((state) => state.auth);
  const accessToken = getCookie('access_token');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await Axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/products/${product_slug}`,
        );
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (product_slug) {
      fetchData();
    }
  }, [product_slug]);

  useEffect(() => {
    const fetchNearbyPharmacies = async () => {
      try {
        const userAddress = userInfo?.addresses?.find(
          (address) => address.id === userInfo.activeAddressId,
        );
        if (!userAddress) return;
        const { data } = await Axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/nearby-pharmacies/products/${product?.id}`,
          {
            params: {
              latitude: userAddress.latitude,
              longitude: userAddress.longitude,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setNearbyPharmacies(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (product && userInfo) {
      fetchNearbyPharmacies();
    }
  }, [product, userInfo]);

  const handleAddToCart = (product: ProductType) => {
    if (product.is_prescription_required) {
      setToast({
        showToast: true,
        toastMessage:
          'Produk ini membutuhkan resep, silahkan melakukan konsultasi',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      navigateToChat();
      return;
    }

    dispatch(increaseOneToCart(product.id));
    setIsProductSelected(product);
  };

  const handleSubtract = (productId: number) => {
    const existingItem = items.find((item) => item.product_id === productId);

    if (existingItem === undefined) {
      return;
    }

    dispatch(deduceOneFromCart(existingItem));
    if (existingItem.quantity === 0) {
      setIsProductSelected(null);
    }
  };

  // const openSelectPharmacyInterface = (pharmacy: PharmacyCart) => {
  //   dispatch(setSelectedPharmacy(pharmacy));
  //   openModal('select-nearby-pharmacy');
  // };

  return (
    <Container>
      <Navbar />
      <Body>
        <ProductDetailContainer>
          {product !== undefined ? (
            <Image
              width={500}
              height={500}
              src={product?.image_url?.toString()}
              alt={product?.product_slug?.toString()}
            />
          ) : (
            <RingLoader loading={product === undefined} />
          )}

          <ProductDetail>
            <h1>{product?.name}</h1>
            <Price>
              Rp{product?.min_price.toLocaleString()} - Rp
              {product?.max_price.toLocaleString()}
            </Price>
            <h3>{product?.selling_unit}</h3>
            <Buttoncontainer>
              <CustomButton
                content='Pilih Apotek'
                onClick={() => setIsModalOpen(true)}
                $width='150px'
                $height='50px'
                $fontSize='18px'
                $color='#00B5C0'
                $bgColor='white'
                $border='#00B5C0'
              />
              {isProductSelected?.id === product?.id &&
              product &&
              items.find((item) => item.product_id === product.id)?.quantity !==
                undefined ? (
                <ButtonAdd>
                  <CustomButton
                    content='-'
                    onClick={
                      product !== undefined
                        ? () => handleSubtract(product?.id)
                        : () => {}
                    }
                    $width='80px'
                    $height='30px'
                    $fontSize='18px'
                    $color='#00B5C0'
                    $bgColor='white'
                    $border='#00B5C0'
                  />
                  <p>
                    {
                      items.find((item) => item.product_id === product?.id)
                        ?.quantity
                    }
                  </p>
                  <CustomButton
                    content='+'
                    onClick={
                      product !== undefined
                        ? () => handleAddToCart(product)
                        : () => {}
                    }
                    $width='80px'
                    $height='30px'
                    $fontSize='18px'
                    $color='#00B5C0'
                    $bgColor='white'
                    $border='#00B5C0'
                  />
                </ButtonAdd>
              ) : (
                <CustomButton
                  content='Tambah ke keranjang'
                  onClick={
                    product !== undefined
                      ? () => handleAddToCart(product)
                      : () => {}
                  }
                  $width='150px'
                  $height='50px'
                  $fontSize='16px'
                />
              )}
            </Buttoncontainer>

            {product?.description && (
              <div>
                <h2>Deskripsi</h2>
                <p>{product?.description}</p>
              </div>
            )}
            {product?.content && (
              <div>
                <h2>Komposisi / Isi</h2>
                <p>{product?.content}</p>
              </div>
            )}
            {product?.dosage && (
              <div>
                <h2>Dosis</h2>
                <p>{product?.dosage}</p>
              </div>
            )}
            {product?.how_to_use && (
              <div>
                <h2>Aturan Pakai</h2>
                <p>{product?.how_to_use}</p>
              </div>
            )}
            {product?.warning && (
              <div>
                <h2>Perhatian</h2>
                <p>{product?.warning}</p>
              </div>
            )}
            {product?.contraindication && (
              <div>
                <h2>Kontra Indikasi</h2>
                <p>{product?.contraindication}</p>
              </div>
            )}
            {product?.packaging && (
              <div>
                <h2>Kemasan</h2>
                <p>{product?.packaging}</p>
              </div>
            )}
            <DialogModal
              isOpen={isModalOpen}
              hasCloseBtn
              onClose={() => setIsModalOpen(false)}
            >
              <SelectPharmacy>
                <h2>Apotek terdekat:</h2>
                <div>
                  {nearbyPharmacies?.map((pharmacy) => (
                    <div key={pharmacy.id}>
                      <p>{pharmacy.name}</p>
                      <p>{pharmacy.address}</p>
                      <p>{pharmacy.distance} km dari rumahmu</p>
                    </div>
                  ))}
                </div>
              </SelectPharmacy>
            </DialogModal>
          </ProductDetail>
        </ProductDetailContainer>
        <Footer />
      </Body>
    </Container>
  );
};

export default ProductDetailPage;
