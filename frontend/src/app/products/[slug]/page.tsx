'use client';
import {
  ButtonAdd,
  Price,
  ProductDetail,
  ProductDetailContainer,
} from '@/styles/pages/product/ProductDetail.styles';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Body, Container } from '@/styles/Global.styles';
import { ProductType } from '@/types/Product';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { addItemToCart, removeItemFromCart } from '@/redux/reducers/cartSlice';
import { RingLoader } from 'react-spinners';
import axios from 'axios';
import Navbar from '@/components/organisms/navbar/Navbar';
import Footer from '@/components/organisms/footer/Footer';
import CustomButton from '@/components/atoms/button/CustomButton';
import Image from 'next/image';

const ProductDetailPage = () => {
  const pathname = usePathname();
  const product_slug = pathname.split('/').pop();
  const [product, setProduct] = useState<ProductType>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
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

  const dispatch = useObatinDispatch();
  const items = useObatinSelector((state) => state.cart.items);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>();

  const handleAddToCart = (product: ProductType) => {
    const existingItem = items.find((item) => item.product_id === product.id);
    if (existingItem) {
      dispatch(
        addItemToCart({
          ...existingItem,
          quantity: +1,
        }),
      );
    } else {
      dispatch(
        addItemToCart({
          product_id: product.id,
          prescription_id: null,
          pharmacy_id: 55524,
          quantity: 1,
        }),
      );
    }
    setSelectedProduct(product);
  };

  const handleSubtract = (productId: number) => {
    const existingItem = items.find((item) => item.product_id === productId);
    if (existingItem && existingItem.quantity > 1) {
      dispatch(
        addItemToCart({
          ...existingItem,
          quantity: -1,
        }),
      );
    } else {
      dispatch(removeItemFromCart({ product_id: productId }));
      setSelectedProduct(null);
    }
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

            {selectedProduct?.id === product?.id ? (
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
                content='Add to Cart'
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
          </ProductDetail>
        </ProductDetailContainer>
        <Footer />
      </Body>
    </Container>
  );
};

export default ProductDetailPage;
