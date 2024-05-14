'use client';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  Body,
  NewSection,
  Fitur,
  FiturContainer,
  Title,
  PopularContainer,
  CategoryContent,
} from '@/styles/pages/homepage/Homepage.styles';
import {
  Bold,
  CategoryCardContainer,
  CategoryName,
  Imagecontainer,
  Price,
  ProductCard,
  Smallfont,
} from '@/styles/pages/product/ProductCard.styles';
import { useEffect, useState } from 'react';
import { Container } from '@/styles/Global.styles';
import { ProductListContainer } from '@/styles/pages/product/ProductListPage.styles';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CategoryType, ProductType } from '@/types/Product';
import { Keyboard, Mousewheel, Navigation } from 'swiper/modules';
import styled, { CSSProperties } from 'styled-components';
import Navbar from '../../organisms/navbar/Navbar';
import Footer from '../../organisms/footer/Footer';
import Banner from '../../molecules/banner/Banner';
import Image from 'next/image';
import toko from '@/assets/homepage/Pharmacist-pana 1.svg';
import konsul from '@/assets/homepage/Researching-amico 1(1).svg';
import CustomButton from '@/components/atoms/button/CustomButton';
import axios from 'axios';

const CustomImage = styled(Image)`
  border-radius: 100%;
`;

const Homepage = (): React.ReactElement => {
  const router = useRouter();
  const [products, setProducts] = useState<Array<ProductType>>([]);
  const [categories, setCategories] = useState<Array<CategoryType>>([]);

  const handleProductClicked = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  const handleCategoryClicked = (id: number) => {
    router.push(`/products?category=${id}`);
  };

  const handleConsultationClicked = () => {
    router.push(`/doctors`);
  };

  const handleShopClicked = () => {
    router.push('/products');
  };

  const fetchCategories = async () => {
    try {
      const { data: res } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/categories`,
      );
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data: res } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/products?limit=5&sort_by=sales`,
      );
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <>
      <Container>
        <Navbar />
        <Container>
          <Body>
            <Banner />
            <FiturContainer>
              <Fitur onClick={() => handleConsultationClicked()}>
                <Image priority src={konsul} alt='obatin' height={150} />
                <p>Konsultasi Dokter</p>
              </Fitur>
              <Fitur onClick={() => handleShopClicked()}>
                <Image priority src={toko} alt='obatin' height={150} />
                <p>Toko Kesehatan</p>
              </Fitur>
            </FiturContainer>
            <NewSection>
              <Title>KATEGORI</Title>
              <CategoryContent>
                <CategoryContent>
                  <Swiper
                    cssMode={true}
                    navigation={true}
                    scrollbar={true}
                    mousewheel={true}
                    modules={[Navigation, Mousewheel, Keyboard]}
                    breakpoints={{
                      320: {
                        slidesPerView: 1,
                      },
                      768: {
                        slidesPerView: 4,
                      },
                      1440: {
                        slidesPerView: 5,
                      },
                    }}
                    style={
                      {
                        '--swiper-pagination-color': '#00B5C0',
                        '--swiper-navigation-color': '#00B5C0',
                        '--align-content': 'center',
                      } as CSSProperties
                    }
                  >
                    {categories?.map((item, i) => {
                      return (
                        <SwiperSlide
                          key={i}
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <CategoryCardContainer
                            onClick={() => handleCategoryClicked(item?.id)}
                          >
                            <CustomImage
                              height={110}
                              width={110}
                              src={
                                item.image_url !== ''
                                  ? item.image_url
                                  : 'https://img.freepik.com/free-vector/virus-cure-concept_23-2148488766.jpg?t=st=1715234591~exp=1715238191~hmac=7d5be4a2f251beedead023dbac5e7c87179fdbb05ff4be5c609ed7bd873b213f&w=826'
                              }
                              alt='category'
                            />
                            <CategoryName>{item.name}</CategoryName>
                          </CategoryCardContainer>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </CategoryContent>
              </CategoryContent>
            </NewSection>
            <NewSection>
              <Title>POPULER</Title>
              <PopularContainer>
                <ProductListContainer>
                  {products?.map((product) => (
                    <ProductCard
                      key={product?.id}
                      onClick={() =>
                        handleProductClicked(product?.product_slug)
                      }
                    >
                      <Imagecontainer>
                        <Image
                          height={150}
                          width={150}
                          src={product?.image_url}
                          alt='banner'
                        />
                      </Imagecontainer>
                      <Bold>{product?.name}</Bold>
                      <Smallfont>{product?.selling_unit}</Smallfont>
                      <Price>
                        Rp{product?.min_price.toLocaleString()} - Rp
                        {product?.max_price.toLocaleString()}
                      </Price>
                      <CustomButton
                        $width='90px'
                        $height='32px'
                        content='Add to Cart'
                        $fontSize='12px'
                      />
                    </ProductCard>
                  ))}
                </ProductListContainer>
              </PopularContainer>
            </NewSection>
          </Body>
        </Container>
      </Container>

      <Footer />
    </>
  );
};

export default Homepage;
