import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { BannerContainer } from '@/styles/molecules/Banner.styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import styled, { CSSProperties } from 'styled-components';
import banner1 from '@/assets/banner1.jpg';
import banner2 from '@/assets/banner2.jpg';
import banner3 from '@/assets/banner3.jpg';
import Image from 'next/image';

const slide_img = [banner1, banner2, banner3];

const CustomImage = styled(Image)`
  width: 100%;
  height: 500px;
  object-fit: cover;

  @media (max-width: 769px) {
    height: 300px;
    width: 300px;
  }
`;

const Banner = (): React.ReactElement => {
  return (
    <BannerContainer>
      <Swiper
        cssMode={true}
        navigation={true}
        pagination={true}
        scrollbar-clickable='true'
        mousewheel={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        effect={'coverflow'}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        style={
          {
            '--swiper-pagination-color': '#fff',
            '--swiper-navigation-color': '#fff',
          } as CSSProperties
        }
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
      >
        {slide_img.map((image, i) => {
          return (
            <SwiperSlide key={i}>
              <CustomImage width={1300} height={500} src={image} alt='banner' />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </BannerContainer>
  );
};

export default Banner;
