import PP from '@/styles/pages/partner/PharmacyProducts.styles';
import styled from 'styled-components';
import { PharmacyType } from '@/types/pharmacyType';
import { INullableProduct } from '@/types/Product';
import { useState } from 'react';
import { DialogModal } from '../modal/dialogModal/DialogModal';
import PharmacyListModalContent from '../modal/modalContent/PharmacyListModalContent';
import ProductListModalContent from '../modal/modalContent/ProductListModalContent';
import axios from 'axios';
import { useToast } from '@/hooks/useToast';
import { getCookie } from 'cookies-next';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { PropagateLoader } from 'react-spinners';
import { InputSwitch } from 'primereact/inputswitch';

const Title = styled.p`
  font-size: 20px;
  font-weight: bold;
`;
const ContentText = styled.p`
  font-size: 16px;
  font-weight: 400;
`;

const ContentHighlighterContent = styled.p`
  font-size: 16px;
  font-weight: 500;
`;

const DeltaStockInput = styled.input`
  width: 80%;
  font-size: 16px;
  padding: 0.3rem;
  text-align: center;
`;

const AddProductContentContainer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledContainerPrice = styled.div`
  width: 75%;
  display: flex;
  flex-direction: row;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const StyledWarningMessageText = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: red;
`;
const CustomPropagateLoader = styled(PropagateLoader)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 'auto';
`;

const ContainerInputSwitchActivateProduct = styled.div`
  width: 60%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AddPharmacyProductContent = ({
  handleChangeProduct = () => {},
}: {
  handleChangeProduct?: () => void;
}): React.ReactElement => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyType>();
  const [isModalPharmacyOpen, setIsModalPharmacyOpen] =
    useState<boolean>(false);
  const { setToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<INullableProduct>({
    id: undefined,
  });
  const [isModalProductOpen, setIsModalProductOpen] = useState<boolean>(false);
  const accessToken = getCookie('access_token');
  const [loading, setLoading] = useState(false);
  const [newProductPrice, setNewProductPrice] = useState<number>(0);
  const [newProductStock, setNewProductStock] = useState<number>(0);
  const [productActiveStatus, setProductActiveStatus] =
    useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editPriceErrorMessage, setEditPriceErrorMessage] =
    useState<string>('');
  const [editStockErrorMessage, setEditStockErrorMessage] =
    useState<string>('');
  const { isDesktopDisplay } = useClientDisplayResolution();
  const insertPayload = new FormData();
  insertPayload.append('is_active', productActiveStatus.toString());
  if (selectedPharmacy?.id != null && selectedProduct?.id != null) {
    insertPayload.append('pharmacy_id', selectedPharmacy.id.toString());
    insertPayload.append('product_id', selectedProduct.id.toString());
  }
  if (newProductPrice != null) {
    insertPayload.append('price', newProductPrice.toString());
  }
  if (newProductStock != null) {
    insertPayload.append('stock', newProductStock.toString());
  }

  const insertPharmacyProduct = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/partners/products`,
        insertPayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setNewProductPrice(0);
      setNewProductStock(0);
      setSelectedPharmacy({});
      setSelectedProduct({});
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
      setToast({
        showToast: true,
        toastMessage: 'Berhasil Menambahkan Produk',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      handleChangeProduct;
    }
  };

  return (
    <>
      <PP.DetailCardContainer>
        {loading && (
          <CustomPropagateLoader
            loading={loading}
            color='#dd1b50'
            speedMultiplier={0.8}
            size={'15px'}
          />
        )}
        {isConfirmModalOpen && (
          <DialogModal
            isOpen={isConfirmModalOpen}
            hasCloseBtn
            onClose={() => setIsConfirmModalOpen(false)}
          >
            <PP.ModalConfirmationContainer>
              <PP.TitleText>
                Apakah anda yakin akan Menambahkan produk ?
              </PP.TitleText>
              <Title>Rincian Produk</Title>
              <ContentHighlighterContent>
                Nama Produk :{' '}
              </ContentHighlighterContent>
              <ContentText>{selectedProduct.name}</ContentText>
              <ContentHighlighterContent>
                Nama Farmasi :{' '}
              </ContentHighlighterContent>
              <ContentText>{selectedPharmacy?.name}</ContentText>
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
                    insertPharmacyProduct();
                  }}
                >
                  Lanjutkan
                </PP.CustomButton>
              </PP.CustomButtonsWrapper>
            </PP.ModalConfirmationContainer>
          </DialogModal>
        )}
        <Title>Tambahkan Produk Baru ke Farmasi</Title>
        {!loading && (
          <>
            <AddProductContentContainer>
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
                    setSelectedPharmacy({ ...selectedPharmacy, id, name });
                    setIsModalPharmacyOpen(false);
                  }}
                />
              </DialogModal>
              <PP.CustomInput
                type='button'
                value={
                  selectedProduct?.name ? selectedProduct.name : 'Pilih Produk'
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
                    if (id != null && name != null) {
                      setSelectedProduct({ ...selectedProduct, id, name });
                    }

                    setIsModalProductOpen(false);
                  }}
                />
              </DialogModal>
            </AddProductContentContainer>
            <StyledContainerPrice>
              {selectedPharmacy != null && selectedProduct != null && (
                <>
                  <DeltaStockInput
                    placeholder={'Masukkan harga produk'}
                    type='number'
                    onChange={(e) => {
                      if (parseInt(e.target.value) < 0) {
                        setEditPriceErrorMessage('Tidak bisa negatif!');
                        return;
                      }
                      if (parseInt(e.target.value) < 500) {
                        setEditPriceErrorMessage('Harga Produk Minimum 500!');
                        return;
                      }
                      setEditPriceErrorMessage('');
                      setNewProductPrice(parseInt(e.target.value));
                    }}
                  ></DeltaStockInput>
                </>
              )}
            </StyledContainerPrice>
            {editPriceErrorMessage != '' && (
              <StyledWarningMessageText>
                {editPriceErrorMessage}
              </StyledWarningMessageText>
            )}
            <StyledContainerPrice>
              {selectedPharmacy != null && selectedProduct != null && (
                <>
                  <DeltaStockInput
                    placeholder={'Masukkan stok produk'}
                    type='number'
                    onChange={(e) => {
                      if (parseInt(e.target.value) < 0) {
                        setEditStockErrorMessage('Tidak bisa negatif!');
                        return;
                      }
                      setEditStockErrorMessage('');
                      setNewProductStock(parseInt(e.target.value));
                    }}
                  ></DeltaStockInput>
                </>
              )}
            </StyledContainerPrice>
            {editStockErrorMessage != '' && (
              <StyledWarningMessageText>
                {editStockErrorMessage}
              </StyledWarningMessageText>
            )}
            <ContainerInputSwitchActivateProduct>
              <p>Aktivasi Produk</p>
              <InputSwitch
                checked={productActiveStatus}
                onChange={() => {
                  setProductActiveStatus(!productActiveStatus);
                }}
              />
            </ContainerInputSwitchActivateProduct>

            {newProductStock > 0 &&
              newProductPrice > 500 &&
              selectedPharmacy != null &&
              selectedProduct != null && (
                <>
                  <StyledContainerPrice>
                    <PP.CustomButton
                      style={{ width: '45%' }}
                      className='danger'
                      onClick={() => {
                        setEditStockErrorMessage('');
                        setEditPriceErrorMessage('');
                        setSelectedPharmacy({});
                        setSelectedProduct({});
                      }}
                    >
                      Batalkan
                    </PP.CustomButton>
                    <PP.CustomButton
                      style={{ width: '45%' }}
                      className='green'
                      onClick={() => {
                        setIsConfirmModalOpen(true);
                      }}
                    >
                      Konfirmasi
                    </PP.CustomButton>
                  </StyledContainerPrice>
                </>
              )}
          </>
        )}
      </PP.DetailCardContainer>
    </>
  );
};

export default AddPharmacyProductContent;
