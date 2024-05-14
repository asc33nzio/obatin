import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  BannerContainer,
  Imagecontainer,
} from '@/styles/molecules/Banner.styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { CSSProperties } from 'styled-components';

const slide_img = [
  'https://img.freepik.com/free-vector/medical-sale-banner-template_23-2149091920.jpg?w=1380&t=st=1715605026~exp=1715605626~hmac=eba75fd8a05229c505764f1967a1480c750b7eba448fb2fb0a214655d93c3346',
  'https://img.freepik.com/free-vector/hospital-healthcare-service-facebook-template_23-2150394108.jpg?w=1380&t=st=1715592727~exp=1715593327~hmac=fafd33ccab233b7df614998f9edae1818adf057113016db7f701e2b9ef987c5a',
  'https://img.freepik.com/free-vector/flat-ophthalmologist-social-media-post-template_23-2149372778.jpg?w=1380&t=st=1715592794~exp=1715593394~hmac=b09480b5b3db4052b10586320717661ef89fd05c5cd1220b5a2dcc62bc2d1c0d',
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
