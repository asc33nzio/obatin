'use client';
import {
  ButtonAdd,
  Buttoncontainer,
  Column,
  Distance,
  PharmacyCard,
  PharmacyItem,
  PharmacyNameContainer,
  Price,
  ProductDetail,
  ProductDetailContainer,
  Row,
  SelectPharmacy,
} from '@/styles/pages/product/ProductDetail.styles';
import {
  increaseOneToCart,
  deduceOneFromCart,
  changePharmacy,
} from '@/redux/reducers/cartSlice';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Body, Container } from '@/styles/Global.styles';
import { ProductType } from '@/types/Product';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { RingLoader } from 'react-spinners';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { navigateToChat, navigateToProductList } from '@/app/actions';
import { useToast } from '@/hooks/useToast';
import { PharmacyCart } from '@/redux/reducers/pharmacySlice';
import { getCookie } from 'cookies-next';
import { DialogModal } from '@/components/organisms/modal/dialogModal/DialogModal';
import Axios from 'axios';
import Navbar from '@/components/organisms/navbar/Navbar';
import Footer from '@/components/organisms/footer/Footer';
import CustomButton from '@/components/atoms/button/CustomButton';
import Image from 'next/image';
import HomeICO from '@/assets/icons/HomeICO';
import ConsulICO from '@/assets/icons/ConsulICO';
import PhoneICO from '@/assets/icons/PhoneICO';

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
  const [nearbyPharmacies, setNearbyPharmacies] = useState<PharmacyCart[]>([]);
  const [PharmacyName, setPharmacyName] = useState<PharmacyCart>();

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
        navigateToProductList();
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
        if (!userInfo) {
          setToast({
            showToast: true,
            toastMessage: 'Maaf, anda masuk/login terlebih dahulu',
            toastType: 'error',
            resolution: isDesktopDisplay ? 'desktop' : 'mobile',
            orientation: 'center',
          });
        } else if (!userAddress) {
          setToast({
            showToast: true,
            toastMessage: 'Maaf, anda harus mengisi alamat terlebih dahulu',
            toastType: 'warning',
            resolution: isDesktopDisplay ? 'desktop' : 'mobile',
            orientation: 'center',
          });
        }
        const { data } = await Axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/nearby-pharmacies/products/${product?.id}`,
          {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSelectedPharmacy = (pharmacy: PharmacyCart) => {
    if (product?.id === undefined) return;
    dispatch(
      changePharmacy({
        product_id: product?.id,
        pharmacy_id: pharmacy?.id,
      }),
    );

    setPharmacyName(pharmacy);
    setIsModalOpen(false);
  };

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
                content={'Pilih Apotek'}
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
                    $height='50px'
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
                    $height='50px'
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
              {PharmacyName ? (
                <PharmacyNameContainer>
                  {PharmacyName?.name}
                </PharmacyNameContainer>
              ) : (
                ''
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
                <p>{product?.dosage.replaceAll('\\n', ' ')}</p>
              </div>
            )}
            {product?.how_to_use && (
              <div>
                <h2>Aturan Pakai</h2>
                <p>{product?.how_to_use.replaceAll('\\n', ' ')}</p>
              </div>
            )}
            {product?.warning && (
              <div>
                <h2>Perhatian</h2>
                <p>{product?.warning.replaceAll('\\n', ' ')}</p>
              </div>
            )}
            {product?.contraindication && (
              <div>
                <h2>Kontra Indikasi</h2>
                <p>{product?.contraindication.replaceAll('\\n', ' ')}</p>
              </div>
            )}
            {product?.packaging && (
              <div>
                <h2>Kemasan</h2>
                <p>{product?.packaging.replaceAll('\\n', ' ')}</p>
              </div>
            )}
            <DialogModal
              isOpen={isModalOpen}
              hasCloseBtn
              onClose={() => setIsModalOpen(false)}
            >
              <SelectPharmacy>
                <h2>Apotek terdekat:</h2>
                <PharmacyCard>
                  {nearbyPharmacies?.map((pharmacy) => (
                    <PharmacyItem
                      key={pharmacy.id}
                      onClick={() => handleSelectedPharmacy(pharmacy)}
                    >
                      <Row>
                        <HomeICO />
                        <h2>{pharmacy.name}</h2>
                      </Row>
                      <Row>
                        <p>{pharmacy.address}</p>
                      </Row>
                      <Row>
                        <Distance>
                          <p>{pharmacy.distance} km dari rumahmu</p>
                        </Distance>
                      </Row>

                      <Row>
                        <Column>
                          <p>Buka: {pharmacy.opening_time}</p>
                          <p>Tutup: {pharmacy.closing_time}</p>
                          <p>
                            Hari Operasional:{' '}
                            {pharmacy.operational_days.join(', ')}
                          </p>
                        </Column>
                        <Column>
                          <div>
                            <ConsulICO />
                            <p>{pharmacy.pharmacist_name}</p>
                          </div>
                          <div>
                            <PhoneICO />
                            <p>{pharmacy.pharmacist_phone}</p>
                          </div>
                        </Column>
                      </Row>
                    </PharmacyItem>
                  ))}
                </PharmacyCard>
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
