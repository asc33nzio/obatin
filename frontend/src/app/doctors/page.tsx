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
  ProductCardContent,
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
import { PaginationDiv } from '@/styles/pages/dashboard/transactions/Transactions.styles';
import PaginationComponent from '@/components/organisms/pagination/PaginationComponent';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export interface IResponseDoctorPagination {
  page: number;
  page_count: number;
  total_records: number;
  limit: number;
}

export interface IResponseDoctor {
  message: string;
  pagination: IResponseDoctorPagination;
  data: DoctorType[];
}

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<IResponseDoctor>();
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorType | null>(null);
  const [specializations, setSpecializations] = useState<DoctorSpecType[]>([]);
  const [page, setPage] = useState(1);
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

  const handlePageJump = (i: number) => {
    setPage(i);
  };

  const handlePrevPage = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page === doctors?.pagination.page_count) return;
    setPage(page + 1);
  };

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors?`;

  const pageParam = page ? `page=${page}&` : '';
  const sortByParam = sortBy ? `sort_by=${sortBy}&` : '';
  const isOnlineParam = isOnline ? `is_online=${isOnline}&` : '';
  const orderByParam = orderBy ? `order=${orderBy}&` : '';

  const fullUrl = url + pageParam + sortByParam + isOnlineParam + orderByParam;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(fullUrl, {
          params: {
            limit: 12,
            page,
            specialization: specSlug,
            sort_by: sortBy,
            is_online: isOnline,
            order: orderBy,
          },
        });

        setDoctors(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [page, sortBy, isOnline, orderBy, fullUrl, specSlug]);

  useEffect(() => {
    setPage(1);
  }, [sortBy, orderBy]);

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

  return (
    <Container className={inter.className}>
      <Navbar />
      <Body>
        <Content>
          <CategoryContainer>
            <SpecializationComponent
              specializations={specializations}
              setSpecSlug={setSpecSlug}
              setParentPage={() => setPage(1)}
            />
          </CategoryContainer>
          <ProductContent>
            <FilterContainer>
              <DoctorFilterComponent
                setSortBy={setSortBy}
                setOrderBy={setOrderBy}
                onClickClear={() => setSpecSlug(null)}
                sortValue={sortBy}
                orderValue={orderBy}
              />
            </FilterContainer>
            <ProductListContainer>
              {doctors?.data?.map((doctor) => (
                <ProductCard
                  key={doctor.id}
                  onClick={() => handleModalOpen(doctor)}
                >
                  <ProductCardContent>
                    <Imagecontainer>
                      <Image
                        height={150}
                        width={150}
                        src='https://unsplash.com/photos/FVh_yqLR9eA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGRvY3RvcnxlbnwwfHx8fDE3MTQ2NTQ1ODR8MA&force=true&w=1920'
                        alt='banner'
                      />
                    </Imagecontainer>
                    {doctor.is_online ? (
                      <IsOnline>Aktif</IsOnline>
                    ) : (
                      <IsOffline>Tidak Aktif</IsOffline>
                    )}
                    <Bold>{doctor.name}</Bold>
                    <Smallfont>{doctor.specialization}</Smallfont>
                    <Experience>
                      {doctor.experiences} tahun pengalaman
                    </Experience>
                  </ProductCardContent>

                  <CustomButton
                    $width='150px'
                    $height='32px'
                    content='Detail dan Konsultasi'
                    $fontSize='12px'
                  />
                </ProductCard>
              ))}
            </ProductListContainer>

            {doctors && doctors.pagination && (
              <PaginationDiv>
                <PaginationComponent
                  page={doctors.pagination.page}
                  totalPages={doctors.pagination.page_count}
                  goToPage={handlePageJump}
                  handlePrevPage={handlePrevPage}
                  handleNextPage={handleNextPage}
                />
              </PaginationDiv>
            )}
          </ProductContent>
        </Content>
        <Footer />

        <InvokableModal
          $doctorDetail={{
            id: selectedDoctor?.id,
            name: selectedDoctor?.name,
            specialization: selectedDoctor?.specialization,
            experiences: selectedDoctor?.experiences,
            fee: selectedDoctor?.fee,
            openingTime: selectedDoctor?.opening_time,
            operationalHours: selectedDoctor?.operational_hours,
            operationalDays: selectedDoctor?.operational_days,
          }}
          modalType='doctor-detail'
          $onOpen={handleModalOpen}
          $isOpen={isModalOpen}
          $onClose={handleModalClose}
        />
      </Body>
    </Container>
  );
};

export default DoctorsPage;
