'use client';
import {
  Content,
  FilterContainer,
  ProductContent,
  ProductListContainer,
  CategoryContainer,
  Experience,
  IsOffline,
  IsOnline,
} from '@/styles/pages/product/ProductListPage.styles';
import {
  Bold,
  Imagecontainer,
  ProductCard,
  Smallfont,
} from '@/styles/pages/product/ProductCard.styles';
import { Body, Container } from '@/styles/Global.styles';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { DoctorSpecType, DoctorType } from '@/types/doctorTypes';
import axios from 'axios';
import CustomButton from '@/components/atoms/button/CustomButton';
import Navbar from '@/components/organisms/navbar/Navbar';
import SpecializationComponent from '@/components/molecules/specialization/Specialization';
import Image from 'next/image';
import DoctorFilterComponent from '@/components/atoms/filter/DoctorFilter';
import Footer from '@/components/organisms/footer/Footer';
import InvokableModal from '@/components/organisms/modal/InvokableModal';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorType | null>(null);
  const [specializations, setSpecializations] = useState<DoctorSpecType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [specSlug, setSpecSlug] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [isOnline] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleModalOpen = (doctor: DoctorType) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedDoctor(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors?`,
          {
            params: {
              limit: 12,
              page,
              specialization: specSlug,
              sort_by: sortBy,
              is_online: isOnline,
              order: orderBy,
            },
          },
        );

        setDoctors([...response.data]);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page, specSlug, sortBy, isOnline, orderBy]);

  useEffect(() => {
    const fetchSpecialization = async () => {
      try {
        const { data: response } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctor-specializations`,
        );
        setSpecializations(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpecialization();
  }, []);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <Container className={inter.className}>
      <Navbar />
      <Body>
        <Content>
          <CategoryContainer>
            <SpecializationComponent
              specializations={specializations}
              setSpecSlug={setSpecSlug}
            />
          </CategoryContainer>
          <ProductContent>
            <FilterContainer>
              <DoctorFilterComponent
                setSortBy={setSortBy}
                setOrderBy={setOrderBy}
              />
            </FilterContainer>
            <ProductListContainer>
              {doctors.map((doctor) => (
                <ProductCard
                  key={doctor.id}
                  onClick={() => handleModalOpen(doctor)}
                >
                  <Imagecontainer>
                    <Image
                      height={150}
                      width={150}
                      src='https://unsplash.com/photos/FVh_yqLR9eA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGRvY3RvcnxlbnwwfHx8fDE3MTQ2NTQ1ODR8MA&force=true&w=1920'
                      alt='banner'
                    />
                  </Imagecontainer>
                  {doctor.is_online ? (
                    <IsOnline>Sedang Aktif</IsOnline>
                  ) : (
                    <IsOffline>Sedang Tidak Aktif</IsOffline>
                  )}
                  <Bold>{doctor.name}</Bold>
                  <Smallfont>{doctor.specialization}</Smallfont>
                  <Experience>{doctor.experiences} tahun pengalaman</Experience>
                  <CustomButton
                    $width='150px'
                    $height='32px'
                    content='Hubungi Dokter'
                    $fontSize='12px'
                  />
                </ProductCard>
              ))}
            </ProductListContainer>

            <CustomButton
              onClick={handleLoadMore}
              disabled={loading}
              content='load more'
              $width='150px'
              $fontSize='18px'
            />
          </ProductContent>
        </Content>
        <Footer />

        <InvokableModal
          $doctorDetail={{
            name: selectedDoctor?.name,
            specialization: selectedDoctor?.specialization,
            experiences: selectedDoctor?.experiences,
            fee: selectedDoctor?.fee,
            openingTime: selectedDoctor?.opening_time,
            operationalHours: selectedDoctor?.operational_hours,
            operationalDays: selectedDoctor?.operational_days,
          }}
          modalType='doctor-detail'
          onOpen={handleModalOpen}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      </Body>
    </Container>
  );
};

export default DoctorsPage;
