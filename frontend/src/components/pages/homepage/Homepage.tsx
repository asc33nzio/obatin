'use client';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  Body,
  Container,
  NewSection,
  Fitur,
  FiturContainer,
  Imagecontainer,
  Title,
  ProductCard,
  Bold,
  Smallfont,
  Content,
} from '@/styles/pages/homepage/Homepage.styles';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Product } from '@/types/Product';
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { CSSProperties } from 'styled-components';
import Navbar from '../../organisms/navbar/Navbar';
import Footer from '../../organisms/footer/Footer';
import Banner from '../../molecules/banner/Banner';
import Image from 'next/image';
import toko from '@/assets/homepage/Pharmacist-pana 1.svg';
import konsul from '@/assets/homepage/Researching-amico 1(1).svg';
import CustomButton from '../../atoms/button/CustomButton';
import Sidebar from '@/components/organisms/sidebar/Sidebar';

const CategoryImg = [
  'https://d2qjkwm11akmwu.cloudfront.net/categories/42753_12-4-2023_9-48-50.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/10080_12-4-2023_9-50-39.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/353198_30-10-2023_18-53-54.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/876467_12-4-2023_9-51-14.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/102678_4-3-2020_14-9-50-1-1-1.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/591887_12-4-2023_9-41-41.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/894816_12-4-2023_9-52-27.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/457303_12-4-2023_9-42-26.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/810949_18-1-2023_16-48-21.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/667210_12-4-2023_9-41-10.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/602092_3-8-2020_17-20-55-1.jpeg',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/734224_19-11-2021_12-13-1-1.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/790299_12-4-2023_9-43-5.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/546575_12-4-2023_9-45-7.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/282182_12-4-2023_9-47-54.png',
  'https://d2qjkwm11akmwu.cloudfront.net/categories/508805_12-4-2023_9-42-2.png',
];

const Homepage = (): React.ReactElement => {
  const [isOpened, setOpened] = useState(false);

  const toggleDrawer = () => {
    setOpened((prev) => !prev);
  };

  return (
    <>
      <Content>
        <Sidebar toggleDrawer={toggleDrawer} isOpened={isOpened} />
        <Body>
          <Navbar isOpened={isOpened} toggleDrawer={toggleDrawer} />
          <Banner />
          <FiturContainer>
            <Fitur>
              <Image priority src={konsul} alt='obatin' height={150} />
              <p>Konsultasi Dokter</p>
            </Fitur>
            <Fitur>
              <Image priority src={toko} alt='obatin' height={150} />
              <p>Toko Kesehatan</p>
            </Fitur>
          </FiturContainer>
          <NewSection>
            <Title>KATEGORI</Title>
            <Container>
              <Swiper
                cssMode={true}
                navigation={true}
                pagination={true}
                scrollbar={true}
                mousewheel={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                breakpoints={{
                  320: {
                    slidesPerView: 2,
                  },
                  630: {
                    slidesPerView: 3,
                  },
                  1400: {
                    slidesPerView: 7,
                  },
                }}
                style={
                  {
                    '--swiper-pagination-color': '#00B5C0',
                    '--swiper-navigation-color': '#00B5C0',
                  } as CSSProperties
                }
              >
                {CategoryImg.map((image, i) => {
                  return (
                    <SwiperSlide key={i} style={{ padding: '2rem' }}>
                      <Imagecontainer src={image} alt='banner' />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </Container>
          </NewSection>
          <NewSection>
            <Title>POPULAR</Title>
            <Container>
              {Product.map((product, i) => {
                return (
                  <ProductCard key={i}>
                    <Imagecontainer src={product.image} alt='banner' />
                    <Bold>{product.name}</Bold>
                    <Smallfont>{product.size}</Smallfont>
                    <p>{product.price}</p>
                    <CustomButton
                      $width='90px'
                      $height='32px'
                      content='Add to Cart'
                      $fontSize='12px'
                    />
                  </ProductCard>
                );
              })}
            </Container>
          </NewSection>
          <Footer />
        </Body>
      </Content>
    </>
  );
};

export default Homepage;
