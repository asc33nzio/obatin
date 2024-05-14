import { useToast } from '@/hooks/useToast';
import { PharmacyProductType } from '@/types/pharmacyProducts';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEffect } from 'react';
import { DialogModal } from '@/components/organisms/modal/dialogModal/DialogModal';
import { Edit } from '@styled-icons/material';
import PP from '@/styles/pages/partner/PharmacyProducts.styles';
import Image from 'next/image';
import styled from 'styled-components';
import axios from 'axios';
import PaginateButton from '@/components/atoms/button/PaginateButton';
import CustomButton from '@/components/atoms/button/CustomButton';

const PharmacyDetailsSection = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

const MiddleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  gap: 1rem;
  margin-bottom: 24px;
  align-items: center;
`;

const PrimaryText = styled.p`
  font-size: 16px;
  font-weight: 600;
`;

const SecondaryText = styled.p`
  font-weight: 14px;
  color: #212121;
`;

const PaymentProofContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PaymentProof = styled(Image)``;

const ProductListTable = styled.table`
  width: 100%;
  border: 1px solid black;
  border-collapse: collapse;
  tr {
    th,
    td {
      border-left: 1px solid black;
      padding-left: 4px;
      text-align: center;
    }
  }
`;

const CustomPropagateLoader = styled(PropagateLoader)`
  position: absolute;
  top: 10%;
  left: 50%;
  margin: 'auto';
`;

const CustomChooseStockMovementDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ContainerEditStockContent = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ContainerEditStockManagement = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 6px;
  margin-bottom: 12px;
  p {
    font-size: 12px;
    font-weight: 400;
  }
`;

const CustomPharmacyChoiceTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const ContainerChoiceIsManualAddition = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const DeltaStockInput = styled.input`
  width: 80%;
  font-size: 16px;
  padding: 0.3rem;
  text-align: center;
`;

const StyledWarningMessageText = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: red;
`;

const TopPartContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CustomCloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 0.3rem;
  cursor: pointer;
`;
const StyledContainerPrice = styled.div`
  width: 70%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CustomEditIcon = styled(Edit)`
  width: 20px;
  height: 20px;
  fill: #00b5c0;
  cursor: pointer;
`;

const PharmacyProductCard = ({
  ppdata,
  handleConfirm,
  handleCloseModal,
}: {
  ppdata: PharmacyProductType;
  handleConfirm: () => void;
  handleCloseModal: () => void;
}): React.ReactElement => {
  const accessToken = getCookie('access_token');
  const { setToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editStockActive, setEditStockActive] = useState(false);
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [mutationErrorMessage, setMutationErrorMessage] = useState<string>('');
  const [openEditPriceInput, setOpenEditPriceInput] = useState<boolean>(false);
  const [editPriceErrorMessage, setEditPriceErrorMessage] =
    useState<string>('');
  const [sourcePharmacyStock, setSourcePharmacyStock] = useState<number>(0);
  const [similarProducts, setSimilarProducts] = useState<PharmacyProductType[]>(
    [],
  );
  const [movementManualChoice, setMovementManualChoice] =
    useState<boolean>(true);
  const [updateType, setUpdateType] = useState<string>('detail');
  const [pharmacyStockMovementChoice, setPharmacyStockMovementChoice] =
    useState<string>('');
  const [isManualMovementAddition, setIsManualMovementAddition] =
    useState<boolean>(true);
  const [stockMovementDelta, setStockMovementDelta] = useState<number>(0);
  const [newProductPrice, setNewProductPrice] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [sourcePharmacyProductId, setSourcePharmacyProductId] =
    useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const updatePayload = new FormData();

  updatePayload.append('update_type', updateType);
  if (updateType == 'manual_addition') {
    updatePayload.append('delta', stockMovementDelta.toString());
    updatePayload.append('is_addition', isManualMovementAddition.toString());
  }
  if (updateType == 'stock_mutation') {
    updatePayload.append(
      'source_pharmacy_product_id',
      sourcePharmacyProductId.toString(),
    );
    updatePayload.append('delta', stockMovementDelta.toString());
  }
  if (updateType == 'detail') {
    if (newProductPrice != null) {
      updatePayload.append('price', newProductPrice.toString());
    }
  }

  const handleResetModalStates = () => {
    setStockMovementDelta(0);
    setSourcePharmacyStock(0);
    setIsManualMovementAddition(true);
    setMutationErrorMessage('');
    setEditStockActive(false);
    setOpenEditPriceInput(false);
    updatePayload.delete('delta');
    updatePayload.delete('is_addition');
    updatePayload.delete('source_pharmacy_product_id');
  };
  const updatePharmacyProduct = async () => {
    try {
      setLoading(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/partners/products/${ppdata?.id}`,
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
    }
  };

  const fetchSimilarProductsData = async () => {
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/partners/products?`,
        {
          params: {
            page: page,
            product_id: ppdata.product_id,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setSimilarProducts([...response.data]);
      setTotalPages(response.pagination.total_pages);
    } catch (error) {
      setToast({
        showToast: true,
        toastMessage: 'Kesalahan dalam mengambil data',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const handleCheckMovementDelta = () => {
    if (sourcePharmacyStock - stockMovementDelta < 0) {
      setMutationErrorMessage('Tidak bisa melebihi stock tersedia! ');
    }
  };

  useEffect(() => {
    if (ppdata?.product_id != null) {
      fetchSimilarProductsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ppdata, page]);

  return (
    <PP.DetailCardContainer>
      <Title>{ppdata?.product_name}</Title>
      <MiddleContainer>
        <PharmacyDetailsSection>
          <TopPartContainer>
            <Title>Detail Produk</Title>
            <CustomCloseBtn
              onClick={() => {
                handleResetModalStates();
                handleCloseModal();
              }}
            >
              x
            </CustomCloseBtn>
          </TopPartContainer>
          <div>
            <PrimaryText>Nama</PrimaryText>
            <SecondaryText>{ppdata?.product_name}</SecondaryText>
          </div>
          <div>
            <PrimaryText>Nama Farmasi</PrimaryText>
            <SecondaryText>{ppdata?.pharmacy_name}</SecondaryText>
          </div>
          <div>
            <PrimaryText>Harga</PrimaryText>
            <StyledContainerPrice>
              {openEditPriceInput && (
                <>
                  <DeltaStockInput
                    placeholder={'Masukkan harga baru'}
                    type='number'
                    onChange={(e) => {
                      if (parseInt(e.target.value) < 0) {
                        setEditPriceErrorMessage('Tidak bisa negatif!');
                        return;
                      }
                      setEditPriceErrorMessage('');
                      setNewProductPrice(parseInt(e.target.value));
                    }}
                  ></DeltaStockInput>
                </>
              )}

              {!openEditPriceInput && (
                <>
                  <SecondaryText>{ppdata?.price}</SecondaryText>
                  <CustomEditIcon
                    onClick={() => {
                      setOpenEditPriceInput(!openEditPriceInput);
                    }}
                  ></CustomEditIcon>
                </>
              )}
            </StyledContainerPrice>
            {editPriceErrorMessage != '' && (
              <StyledWarningMessageText>
                {editPriceErrorMessage}
              </StyledWarningMessageText>
            )}
            {openEditPriceInput && (
              <>
                <ContainerEditStockContent>
                  <PP.CustomButton
                    style={{ width: '45%' }}
                    className='danger'
                    onClick={() => {
                      setIsEditPriceModalOpen(false);
                      setOpenEditPriceInput(false);
                      setEditPriceErrorMessage('');
                    }}
                  >
                    Batalkan
                  </PP.CustomButton>
                  <PP.CustomButton
                    style={{ width: '45%' }}
                    className='green'
                    disabled={
                      newProductPrice < 500 || editPriceErrorMessage != ''
                    }
                    onClick={() => {
                      setIsEditPriceModalOpen(true);
                    }}
                  >
                    Konfirmasi
                  </PP.CustomButton>
                </ContainerEditStockContent>
              </>
            )}
          </div>
          <>
            {isEditPriceModalOpen && (
              <DialogModal
                isOpen={isEditPriceModalOpen}
                hasCloseBtn
                onClose={() => setIsEditPriceModalOpen(false)}
              >
                <PP.ModalConfirmationContainer>
                  <PP.TitleText>
                    Apakah anda yakin akan mengubah harga produk ini?
                  </PP.TitleText>
                  <PP.CustomButtonsWrapper>
                    <PP.CustomButton
                      onClick={() => {
                        setIsEditPriceModalOpen(false);
                      }}
                    >
                      Tutup
                    </PP.CustomButton>
                    <PP.CustomButton
                      className='green'
                      onClick={() => {
                        setIsEditPriceModalOpen(false);
                        updatePharmacyProduct();
                        handleConfirm();
                        handleResetModalStates();
                      }}
                    >
                      Lanjutkan
                    </PP.CustomButton>
                  </PP.CustomButtonsWrapper>
                </PP.ModalConfirmationContainer>
              </DialogModal>
            )}
          </>
          <div>
            <PrimaryText>Stock</PrimaryText>
            <ContainerEditStockContent>
              <SecondaryText>{ppdata?.stock}</SecondaryText>
              <CustomButton
                content='edit stock'
                style={{ marginRight: '1rem' }}
                $width='80px'
                $height='30px'
                $fontSize='.8rem'
                $color={editStockActive ? 'white' : '#00B5C0'}
                $bgColor={editStockActive ? '#00B5C0' : 'white'}
                $border='#00B5C0'
                onClick={() => {
                  setSourcePharmacyStock(ppdata.stock);
                  setEditStockActive(!editStockActive);
                  setUpdateType('manual_addition');
                }}
              ></CustomButton>
            </ContainerEditStockContent>

            {isConfirmModalOpen && (
              <DialogModal
                isOpen={isConfirmModalOpen}
                hasCloseBtn
                onClose={() => setIsConfirmModalOpen(false)}
              >
                <PP.ModalConfirmationContainer>
                  <PP.TitleText>
                    Apakah anda yakin akan{' '}
                    {isManualMovementAddition ? 'menambahkan' : 'mengurangi'}{' '}
                    stock?
                  </PP.TitleText>
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
                        setIsConfirmModalOpen(false);
                        updatePharmacyProduct();
                        handleConfirm();
                        handleResetModalStates();
                      }}
                    >
                      Lanjutkan
                    </PP.CustomButton>
                  </PP.CustomButtonsWrapper>
                </PP.ModalConfirmationContainer>
              </DialogModal>
            )}
            {editStockActive && (
              <>
                <CustomChooseStockMovementDiv>
                  <CustomButton
                    content='Penambahan Manual'
                    style={{ marginRight: '1rem' }}
                    $height='30px'
                    $fontSize='.8rem'
                    $color={movementManualChoice ? 'white' : '#00B5C0'}
                    $bgColor={movementManualChoice ? '#00B5C0' : 'white'}
                    $border='#00B5C0'
                    onClick={() => {
                      setMovementManualChoice(true);
                      setUpdateType('manual_addition');
                      setPharmacyStockMovementChoice('');
                      setMutationErrorMessage('');
                      updatePayload.delete('pharmacy_source_id');
                      updatePayload.delete('delta');
                    }}
                  ></CustomButton>
                  <CustomButton
                    content='Farmasi Lain'
                    style={{ marginRight: '1rem' }}
                    $height='30px'
                    $fontSize='.8rem'
                    $color={movementManualChoice ? '#00B5C0' : 'white'}
                    $bgColor={movementManualChoice ? 'white' : '#00B5C0'}
                    $border='#00B5C0'
                    onClick={() => {
                      setMovementManualChoice(false);
                      setUpdateType('stock_mutation');
                      setMutationErrorMessage('');
                      updatePayload.delete('is_addition');
                      updatePayload.delete('delta');
                    }}
                  ></CustomButton>
                </CustomChooseStockMovementDiv>
                {movementManualChoice && (
                  <>
                    <ContainerChoiceIsManualAddition>
                      <CustomButton
                        content='Tambah Stock'
                        style={{ marginRight: '1rem' }}
                        $height='30px'
                        $fontSize='.8rem'
                        $color={isManualMovementAddition ? 'white' : '#00B5C0'}
                        $bgColor={
                          isManualMovementAddition ? '#00B5C0' : 'white'
                        }
                        $border='#00B5C0'
                        onClick={() => {
                          if (isManualMovementAddition) return;
                          setIsManualMovementAddition((prev) => !prev);
                          setMutationErrorMessage('');
                        }}
                      ></CustomButton>
                      <CustomButton
                        content='Kurangi Stock'
                        style={{ marginRight: '1rem' }}
                        $height='30px'
                        $fontSize='.8rem'
                        $color={isManualMovementAddition ? '#00B5C0' : 'white'}
                        $bgColor={
                          isManualMovementAddition ? 'white' : '#00B5C0'
                        }
                        $border='#00B5C0'
                        onClick={() => {
                          if (!isManualMovementAddition) return;
                          setIsManualMovementAddition((prev) => !prev);
                          handleCheckMovementDelta();
                        }}
                      ></CustomButton>
                    </ContainerChoiceIsManualAddition>
                    <DeltaStockInput
                      placeholder={
                        'Jumlah yang ' +
                        (isManualMovementAddition ? 'ditambahkan' : 'dikurangi')
                      }
                      type='number'
                      onChange={(e) => {
                        if (parseInt(e.target.value) < 0) {
                          setMutationErrorMessage('Tidak bisa negatif!');
                          return;
                        }

                        if (parseInt(e.target.value) > sourcePharmacyStock) {
                          if (!isManualMovementAddition) {
                            setMutationErrorMessage(
                              'Tidak bisa melebihi stock tersedia!',
                            );
                            return;
                          }
                        }
                        setMutationErrorMessage('');
                        setStockMovementDelta(parseInt(e.target.value));
                      }}
                    ></DeltaStockInput>
                    {mutationErrorMessage != '' && (
                      <StyledWarningMessageText>
                        {mutationErrorMessage}
                      </StyledWarningMessageText>
                    )}
                    <ContainerEditStockContent>
                      <PP.CustomButton
                        style={{ width: '45%' }}
                        className='danger'
                        onClick={() => {
                          setEditStockActive(!editStockActive);
                          handleResetModalStates();
                        }}
                      >
                        Batalkan
                      </PP.CustomButton>
                      <PP.CustomButton
                        style={{ width: '45%' }}
                        className='green'
                        disabled={mutationErrorMessage != ''}
                        onClick={() => {
                          setIsConfirmModalOpen(true);
                        }}
                      >
                        Konfirmasi
                      </PP.CustomButton>
                    </ContainerEditStockContent>
                  </>
                )}
                {!movementManualChoice && (
                  <CustomPharmacyChoiceTitle>
                    Farmasi Pilihan
                  </CustomPharmacyChoiceTitle>
                )}
                {pharmacyStockMovementChoice != '' && (
                  <>
                    <ContainerEditStockManagement>
                      <p>{pharmacyStockMovementChoice}</p>
                    </ContainerEditStockManagement>
                    <DeltaStockInput
                      placeholder={'Jumlah yang dipindahkan'}
                      type='number'
                      onChange={(e) => {
                        if (parseInt(e.target.value) < 0) {
                          setMutationErrorMessage('Tidak bisa negatif!');
                          return;
                        }
                        if (parseInt(e.target.value) > sourcePharmacyStock) {
                          setMutationErrorMessage(
                            'Tidak bisa melebihi stock tersedia!',
                          );
                          return;
                        }
                        setMutationErrorMessage('');
                        setStockMovementDelta(parseInt(e.target.value));
                      }}
                    ></DeltaStockInput>
                    {mutationErrorMessage != '' && (
                      <StyledWarningMessageText>
                        {mutationErrorMessage}
                      </StyledWarningMessageText>
                    )}
                    <ContainerEditStockContent>
                      <PP.CustomButton
                        style={{ width: '45%' }}
                        className='danger'
                        onClick={() => {
                          setEditStockActive(!editStockActive);
                          handleResetModalStates();
                        }}
                      >
                        Batalkan
                      </PP.CustomButton>
                      <PP.CustomButton
                        style={{ width: '45%' }}
                        className='green'
                        disabled={mutationErrorMessage != ''}
                        onClick={() => {
                          setIsConfirmModalOpen(true);
                        }}
                      >
                        Konfirmasi
                      </PP.CustomButton>
                    </ContainerEditStockContent>
                  </>
                )}
              </>
            )}
          </div>
        </PharmacyDetailsSection>
        <PaymentProofContainer>
          <PrimaryText>Gambar Product</PrimaryText>
          <PaymentProof
            width={300}
            height={300}
            src={ppdata?.image_url ?? ''}
            alt='Gambar Produk Farmasi'
          />
        </PaymentProofContainer>
      </MiddleContainer>
      {loading && (
        <CustomPropagateLoader
          loading={loading}
          color='#dd1b50'
          speedMultiplier={0.8}
          size={'15px'}
        />
      )}
      {!loading && (
        <ProductListTable>
          <thead>
            <tr>
              <th>Gambar</th>
              <th>Nama</th>
              <th>Nama Farmasi</th>
              <th>Harga Satuan</th>
              <th>Stock</th>
              {editStockActive && !movementManualChoice && (
                <th>Sumber Farmasi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {similarProducts?.map((item, index) => {
              if (item.id == ppdata?.id) return null;
              return (
                <tr key={index}>
                  <td>
                    <Image
                      width={50}
                      height={50}
                      src={item?.image_url}
                      alt={item?.product_name}
                    />
                  </td>
                  <td>{item?.product_name}</td>
                  <td>{item?.pharmacy_name}</td>
                  <td>{item?.price}</td>
                  <td>{item?.stock}</td>
                  {editStockActive && !movementManualChoice && (
                    <td>
                      <CustomButton
                        content='Pilih'
                        style={{ marginRight: '1rem' }}
                        $height='30px'
                        $fontSize='.8rem'
                        $color='#00B5C0'
                        $bgColor='white'
                        $border='#00B5C0'
                        onClick={() => {
                          setPharmacyStockMovementChoice(item?.pharmacy_name);
                          setSourcePharmacyProductId(item?.id);
                          setSourcePharmacyStock(item?.stock);
                        }}
                      ></CustomButton>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </ProductListTable>
      )}
      <PaginateButton
        disabled={page === 1}
        onClick={() => {
          handlePrevPage();
        }}
        style={{ marginRight: '12px', width: '5%', height: '5%' }}
        buttonType='prev'
      ></PaginateButton>
      <PaginateButton
        disabled={page === totalPages}
        onClick={() => {
          handleNextPage();
        }}
        style={{ marginRight: '12px', width: '5%', height: '5%' }}
        buttonType='next'
      ></PaginateButton>
    </PP.DetailCardContainer>
  );
};

export default PharmacyProductCard;
