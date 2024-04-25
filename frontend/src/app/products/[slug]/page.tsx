'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Body, Container } from '@/styles/Global.styles';
import { ProductType } from '@/types/Product';
import Sidebar from '@/components/organisms/sidebar/Sidebar';
import Navbar from '@/components/organisms/navbar/Navbar';
import Footer from '@/components/organisms/footer/Footer';
import {
  ButtonAdd,
  Price,
  ProductDetail,
  ProductDetailContainer,
} from '@/styles/pages/product/ProductDetail.styles';
import CustomButton from '@/components/atoms/button/CustomButton';
import Image from 'next/image';

const ProductDetailPage = () => {
  const pathname = usePathname();
  const product_slug = pathname.split('/').pop();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [isOpened, setOpened] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
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

  const toggleDrawer = () => {
    setOpened((prev) => !prev);
  };

  const handleAddToChart = () => {
    setIsClicked(true);
  };

  const handleAdd = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleSubtract = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Sidebar toggleDrawer={toggleDrawer} isOpened={isOpened} />
      <Body>
        <Navbar isOpened={isOpened} toggleDrawer={toggleDrawer} />
        <ProductDetailContainer>
          <Image
            width={500}
            height={500}
            src={product?.image_url}
            alt={product?.product_slug}
          />
          {/* <Image src={product?.image_url} alt={product?.product_slug} /> */}
          <ProductDetail>
            <h1>{product?.name}</h1>
            <Price>
              Rp{product?.min_price.toLocaleString()} - Rp
              {product?.max_price.toLocaleString()}
            </Price>
            <h3>{product?.selling_unit}</h3>
            {!isClicked ? (
              <CustomButton
                content='Add to Cart'
                onClick={handleAddToChart}
                $width='150px'
                $height='50px'
                $fontSize='16px'
              />
            ) : (
              <ButtonAdd>
                <CustomButton
                  content='+'
                  onClick={handleAdd}
                  $width='80px'
                  $height='30px'
                  $fontSize='18px'
                  $color='#00B5C0'
                  $bgColor='white'
                  $border='#00B5C0'
                />
                <p>{quantity}</p>
                <CustomButton
                  content='-'
                  onClick={handleSubtract}
                  $width='80px'
                  $height='30px'
                  $fontSize='18px'
                  $color='#00B5C0'
                  $bgColor='white'
                  $border='#00B5C0'
                />
              </ButtonAdd>
            )}

            <div>
              <h2>Deskripsi</h2>
              <p>{product?.description}</p>
            </div>
            <div>
              <h2>Komposisi / Isi</h2>
              <p>{product?.content}</p>
            </div>
            <div>
              <h2>Dosis</h2>
              <p>{product?.dosage}</p>
            </div>
            <div>
              <h2>Aturan Pakai</h2>
              <p>{product?.how_to_use}</p>
            </div>
            <div>
              <h2>Perhatian</h2>
              <p>{product?.warning}</p>
            </div>
            <div>
              <h2>Kontra Indikasi</h2>
              <p>{product?.contraindication}</p>
            </div>
            <div>
              <h2>Kemasan</h2>
              <p>{product?.packaging}</p>
            </div>
          </ProductDetail>
        </ProductDetailContainer>
        <Footer />
      </Body>
    </Container>
  );
};

export default ProductDetailPage;
