/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

import { InputSwitch } from 'primereact/inputswitch';
import { useState } from 'react';
import axios from 'axios';
import PP from '@/styles/pages/partner/PharmacyProducts.styles';
import { PharmacyProductType } from '@/types/pharmacyProducts';
import { getCookie } from 'cookies-next';
import { useEffect } from 'react';
import { DialogModal } from '@/components/organisms/modal/dialogModal/DialogModal';
import { PropagateLoader } from 'react-spinners';
import Image from 'next/image';
import styled from 'styled-components';
import CustomButton from '@/components/atoms/button/CustomButton';
import PharmacyProductCard from '@/components/molecules/cards/PharmacyProductCard';
import { PaginationInfoItf } from '@/types/transactionTypes';
import PaginationComponent from '@/components/organisms/pagination/PaginationComponent';
import PharmacyListModalContent from '@/components/organisms/modal/modalContent/PharmacyListModalContent';
import { PharmacyType } from '@/types/pharmacyType';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useToast } from '@/hooks/useToast';
import ProductListModalContent from '@/components/organisms/modal/modalContent/ProductListModalContent';
import { INullableProduct } from '@/types/Product';
import AddPharmacyProductContent from '@/components/organisms/admin/AddPharmacyProductContent';
import NavbarPartner from '@/components/organisms/navbar/NavbarPartner';

const StyledContentContainer = styled.section`
  width: 80vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`;

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const CustomPropagateLoader = styled(PropagateLoader)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 'auto';
`;
export const ClearTxFilterButton = styled.button`
  cursor: pointer;
  width: 150px;
  height: 50px;

  border-radius: 12px;
  background-color: transparent;
  border: none;
  outline: none;

  font-size: 18px;
  font-weight: 700;
  color: #00b5c0;
`;

export const ContainerChoicePharmacyProduct = styled.div`
  width: 10%;
  display: flex;
  margin-left: 10%;
  justify-content: center;
  align-items: center;
`;

const PartnersPage = () => {
  const [pharmacyProducts, setPharmacyProducts] = useState<
    PharmacyProductType[]
  >([]);
  const [page, setPage] = useState(1);
  const accessToken = getCookie('access_token');
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [searchPharmacy, setSearchPharmacy] = useState<string | null>(null);
  const [searchProduct, setSearchProduct] = useState<string | null>(null);
  const [isStatusChange, setIsStatusChange] = useState<boolean>(false);
  const [productActiveStatus, setProductActiveStatus] =
    useState<boolean>(false);
  const { setToast } = useToast();
  const [limit, setLimit] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [refetchState, setRefectState] = useState<boolean>(false);
  const [selectedPharmacyProducts, setSelectedPharmacyProducts] =
    useState<PharmacyProductType | null>(null);
  const [selectedUpdatePharmacyProducts, setSelectedUpdatePharmacyProducts] =
    useState<PharmacyProductType | null>(null);
  const [isModalPharmacyOpen, setIsModalPharmacyOpen] =
    useState<boolean>(false);
  const [isModalProductOpen, setIsModalProductOpen] = useState<boolean>(false);
  const [isModalAddProductOpen, setIsModalAddProductOpen] =
    useState<boolean>(false);
  const [productPagination, setProductPagination] = useState<PaginationInfoItf>(
    { limit: 10, page: 1, page_count: 1, total_records: 0 },
  );
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyType>();
  const [selectedProduct, setSelectedProduct] = useState<INullableProduct>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/partners/products?`,
        {
          params: {
            pharmacy_id: selectedPharmacy?.id,
            product_id: selectedProduct?.id,
            classification: classification,
            search: searchProduct,
            search_pharmacy: searchPharmacy,
            sort_by: sortBy,
            order: orderBy,
            limit: limit,
            page,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setPharmacyProducts([...response.data]);
      setProductPagination(response.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const updatePharmacyProduct = async () => {
    try {
      setLoading(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/partners/products/${selectedUpdatePharmacyProducts?.id}`,
        updatePayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      setToast({
        showToast: true,
        toastMessage: 'Kesalahan dalam melakukan permintaan',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      console.error(error);
    } finally {
      setLoading(false);
      setIsConfirmModalOpen(false);
      fetchData();
    }
  };
  const updatePayload = new FormData();
  updatePayload.append('update_type', 'detail');
  if (isStatusChange == true) {
    updatePayload.append('is_active', productActiveStatus.toString());
  }

  const handlePageJump = (i: number) => {
    setPage(i);
  };

  const handlePrevPage = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page === productPagination.page_count) return;
    setPage(page + 1);
  };

  const handleResetFilter = () => {
    setSelectedPharmacy({});
    setSelectedProduct({});
    setClassification(null);
    setPage(1);
    setLimit(12);
    setSortBy(null);
  };

  useEffect(() => {
    fetchData();
    setIsModalOpen(false);
  }, [
    page,
    limit,
    !refetchState,
    selectedPharmacy,
    selectedProduct,
    classification,
    isModalAddProductOpen,
    sortBy,
    orderBy,
  ]);

  return (
    <>
      <PageContainer>
        <NavbarPartner />
        <ContainerChoicePharmacyProduct>
          <PP.FilterStatus
            onChange={(e) => setIsModalAddProductOpen(e.target.value == 'true')}
          >
            <option value='false'>List Produk</option>
            <option value='true'>Tambah Produk ke Farmasi</option>
          </PP.FilterStatus>
        </ContainerChoicePharmacyProduct>

        <StyledContentContainer>
          {!isModalAddProductOpen && (
            <>
              <PP.TableFilterWrapper>
                <PP.FilterContainer>
                  <CustomButton
                    content='Tambahkan Produk'
                    style={{ marginRight: '1rem' }}
                    $width='160px'
                    $height='30px'
                    $fontSize='.8rem'
                    $color={'white'}
                    $bgColor={'#00B5C0'}
                    $border='#00B5C0'
                    onClick={() => {
                      setIsModalAddProductOpen(true);
                    }}
                  ></CustomButton>
                  <PP.LimitInput
                    style={{ width: '60px' }}
                    placeholder='limit'
                    onBlur={(e) => {
                      if (!isNaN(parseInt(e.target.value))) {
                        setLimit(parseInt(e.target.value));
                      }
                    }}
                    type='number'
                  />
                  <PP.SearchTextInput
                    placeholder='Cari Farmasi'
                    onChange={(e) => {
                      setSearchPharmacy(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchData();
                        setPage(1);
                      }
                    }}
                    type='text'
                  />
                  <PP.SearchTextInput
                    placeholder='Cari Produk'
                    onChange={(e) => {
                      setSearchProduct(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchData();
                        setPage(1);
                      }
                    }}
                    type='text'
                  />
                  <PP.CustomInput
                    type='button'
                    value={
                      selectedProduct?.name
                        ? selectedProduct.name
                        : 'Pilih Produk'
                    }
                    onClick={() => setIsModalProductOpen(true)}
                  />
                  <DialogModal
                    isOpen={isModalProductOpen}
                    hasCloseBtn
                    onClose={() => setIsModalProductOpen(false)}
                  >
                    <ProductListModalContent
                      handleChangeProduct={(id, name) => {
                        setPage(1);
                        if (id != null && name != null) {
                          setSelectedProduct({ ...selectedProduct, id, name });
                        }

                        setIsModalProductOpen(false);
                      }}
                    />
                  </DialogModal>
                  <PP.CustomInput
                    type='button'
                    value={
                      selectedPharmacy?.name
                        ? selectedPharmacy.name
                        : 'Pilih Apotek'
                    }
                    onClick={() => setIsModalPharmacyOpen(true)}
                  />
                  <DialogModal
                    isOpen={isModalPharmacyOpen}
                    hasCloseBtn
                    onClose={() => setIsModalPharmacyOpen(false)}
                  >
                    <PharmacyListModalContent
                      handleChangePharmacy={(id, name) => {
                        setPage(1);

                        setSelectedPharmacy({ ...selectedPharmacy, id, name });

                        setIsModalPharmacyOpen(false);
                      }}
                    />
                  </DialogModal>

                  <PP.FilterStatus
                    onChange={(e) => setClassification(e.target.value)}
                  >
                    <option value='obat_bebas'>Obat Bebas</option>
                    <option value='obat_keras'>Obat Keras</option>
                    <option value='obat_bebas_terbatas'>
                      Obat Bebas Terbatas
                    </option>
                    <option value='non_obat'>Non Obat</option>
                  </PP.FilterStatus>
                  <PP.FilterStatus
                    onChange={(e) => setSortBy(e.target.value)}
                    defaultValue={''}
                  >
                    <option>Urutkan</option>
                    <option value='name'>Nama Produk</option>
                    <option value='sales'>Penjualan</option>
                    <option value='price'>Harga</option>
                    <option value='pharmacy'>Nama Farmasi</option>
                  </PP.FilterStatus>
                  <PP.FilterStatus
                    onChange={(e) => setOrderBy(e.target.value)}
                    defaultValue={''}
                  >
                    <option>Mengurut Dari</option>
                    <option value='desc'>Tinggi ke Rendah</option>
                    <option value='asc'>Rendah ke Tinggi</option>
                  </PP.FilterStatus>
                  <ClearTxFilterButton onClick={() => handleResetFilter()}>
                    Hapus Filter
                  </ClearTxFilterButton>
                </PP.FilterContainer>
                <PP.TableContainer>
                  {loading && (
                    <CustomPropagateLoader
                      loading={loading}
                      color='#dd1b50'
                      speedMultiplier={0.8}
                      size={'15px'}
                    />
                  )}
                  {!loading && (
                    <PP.Table>
                      <thead>
                        <tr>
                          <th>id</th>
                          <th>Image</th>
                          <th style={{ textAlign: 'left' }}>Name</th>
                          <th style={{ textAlign: 'left' }}>Nama Farmasi</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Total Penjualan</th>
                          <th>Edit</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pharmacyProducts.map((item, index) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? 'green' : ''}
                          >
                            <td>{item.id}</td>
                            <td>
                              <Image
                                height={40}
                                width={40}
                                alt='product image'
                                src={item.image_url}
                              ></Image>
                            </td>
                            <td style={{ textAlign: 'left' }}>
                              {item.product_name}
                            </td>
                            <td style={{ textAlign: 'left' }}>
                              {item.pharmacy_name}
                            </td>
                            <td>Rp. {item.price.toLocaleString()}</td>
                            <td>{item.stock}</td>
                            <td>{item.sales}</td>
                            <td>
                              <CustomButton
                                content='edit produk'
                                onClick={() => {
                                  setSelectedPharmacyProducts({ ...item });
                                  setIsModalOpen(true);
                                }}
                                style={{ marginRight: '1rem' }}
                                $width='80px'
                                $height='30px'
                                $fontSize='.8rem'
                                $color='#00B5C0'
                                $bgColor='white'
                                $border='#00B5C0'
                              />
                            </td>
                            <td>
                              <InputSwitch
                                checked={item.is_active}
                                onClick={() => {
                                  setSelectedUpdatePharmacyProducts({
                                    ...item,
                                  });
                                }}
                                onChange={() => {
                                  setIsStatusChange(true);
                                  setProductActiveStatus(!item.is_active);
                                  setIsConfirmModalOpen(true);
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </PP.Table>
                  )}
                  {isConfirmModalOpen && (
                    <DialogModal
                      isOpen={isConfirmModalOpen}
                      hasCloseBtn
                      onClose={() => setIsConfirmModalOpen(false)}
                    >
                      <PP.ModalConfirmationContainer>
                        <PP.TitleText>
                          Apakah anda yakin akan mengubah status aktif produk
                        </PP.TitleText>
                        {loading && (
                          <CustomPropagateLoader
                            loading={loading}
                            color='#dd1b50'
                            speedMultiplier={0.8}
                            size={'15px'}
                          />
                        )}
                        <PP.CustomButtonsWrapper>
                          <PP.CustomButton
                            onClick={() => {
                              setIsConfirmModalOpen(false);
                            }}
                          >
                            Tutup
                          </PP.CustomButton>
                          <PP.CustomButton
                            className='green'
                            onClick={() => {
                              updatePharmacyProduct();
                            }}
                          >
                            Lanjutkan
                          </PP.CustomButton>
                        </PP.CustomButtonsWrapper>
                      </PP.ModalConfirmationContainer>
                    </DialogModal>
                  )}
                </PP.TableContainer>
                <DialogModal
                  isOpen={isModalOpen}
                  hasCloseBtn={false}
                  onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPharmacyProducts(null);
                  }}
                >
                  <PharmacyProductCard
                    handleCloseModal={() => {
                      setIsModalOpen(false);
                    }}
                    handleConfirm={() => setRefectState(!refetchState)}
                    ppdata={selectedPharmacyProducts as PharmacyProductType}
                  />
                </DialogModal>
                <PP.PaginationButtonContainer style={{ marginBottom: '20px' }}>
                  <PaginationComponent
                    page={page}
                    totalPages={productPagination?.page_count}
                    goToPage={handlePageJump}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                  />
                </PP.PaginationButtonContainer>
              </PP.TableFilterWrapper>
            </>
          )}
          {isModalAddProductOpen && (
            <>
              <AddPharmacyProductContent
                handleChangeProduct={() => {
                  fetchData();
                }}
              ></AddPharmacyProductContent>
            </>
          )}
        </StyledContentContainer>
      </PageContainer>
    </>
  );
};

export default PartnersPage;
