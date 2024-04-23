import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  BannerContainer,
  Imagecontainer,
} from '@/styles/pages/homepage/Banner.styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { CSSProperties } from 'styled-components';

const slide_img = [
  'https://unsplash.com/photos/k7ll1hpdhFA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8bWVkaWNhbHxlbnwwfHx8fDE3MTMzMzk1MDV8MA&force=true&w=1920',
  'https://unsplash.com/photos/k7ll1hpdhFA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8bWVkaWNhbHxlbnwwfHx8fDE3MTMzMzk1MDV8MA&force=true&w=1920',
  'https://unsplash.com/photos/k7ll1hpdhFA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8bWVkaWNhbHxlbnwwfHx8fDE3MTMzMzk1MDV8MA&force=true&w=1920',
];

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
              <Imagecontainer src={image} alt='banner' />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </BannerContainer>
  );
};

export default Banner;
