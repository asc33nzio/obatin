'use client';
import EditIcon from '@/assets/admin/EditIcon';
import MagnifyBlueICO from '@/assets/icons/MagnifyBlueICO';
import RegularInput from '@/components/atoms/input/RegularInput';
import Navbar from '@/components/organisms/navbar/Navbar';
import PaginationComponent from '@/components/organisms/pagination/PaginationComponent';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useToast } from '@/hooks/useToast';
import { PaginationDiv } from '@/styles/pages/dashboard/transactions/Transactions.styles';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import LogoPartner from '../../../assets/DefaultPartnerLogo.jpeg';

export interface IGetAllPartnerPagination {
  page: number;
  page_count: number;
  total_records: number;
  limit: number;
}

export interface IGetAllPartnerResponse {
  message: string;
  data: IGetAllPartnerResponseData[];
  pagination: IGetAllPartnerPagination;
}

export interface IGetAllPartnerResponseData {
  id: number;
  name: string;
  logo_url: string;
}

export interface IGetDetailPartnerResponse {
  message: string;
  data: IGetDetailPartnerResponseData;
}

export interface IGetDetailPartnerResponseData {
  id: number;
  name: string;
  logo_url: string;
  email: string;
}

function isEmailPattern(email: string) {
  return /^[^@]+@[^@]+\.[^@]+$/u.test(email);
}

function isPasswordPattern(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

function PartnerPage() {
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputSearchValue, setInputSearchValue] = useState<string>('');
  const [isModalEditPartnerOpen, setIsModalEditPartnerOpen] =
    useState<boolean>(false);
  const [isModalAddPartnerOpen, setIsModalAddPartnerOpen] =
    useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [refetchGetAllPartner, setRefetchGetAllPartner] =
    useState<boolean>(true);
  const [refetchGetOnePartner, setRefetchGetOnePartner] =
    useState<boolean>(true);
  const accessToken = getCookie('access_token');
  const [page, setPage] = useState(1);
  const [paramSearchValue, setParamSearchValue] = useState<string | null>('');
  const [paramLimitValue, setParamLimitValue] = useState<number | null>(null);
  const [paramsState, setParamsState] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<{
    [key: string]: string | Blob;
  }>({});
  const [inputLimitValue, setInputLimitValue] = useState<string>('');
  const [selectedIdPartner, setSelectedIdPartner] = useState<number | null>(
    null,
  );

  const fetcherGetAllPartner = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

  const {
    data: dataGetAllPartnerResponse,
    isLoading: loadingGetAllDataPartner,
  } = useSWR<IGetAllPartnerResponse>(
    refetchGetAllPartner
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/partners?page=${page}&limit=${paramLimitValue}&${paramsState}`
      : null,
    fetcherGetAllPartner,
  );

  useEffect(() => {
    if (paramSearchValue?.trim() === '') {
      setParamsState('');
    } else {
      setParamsState(`search=${paramSearchValue}`);
    }
  }, [paramSearchValue]);

  useEffect(() => {
    setParamsState(``);
  }, []);

  useEffect(() => {
    setPage(1);
    setParamLimitValue(10);
  }, []);

  useEffect(() => {
    if (paramSearchValue?.trim() === '') {
      setParamsState('');
    } else {
      setParamsState(`search=${paramSearchValue}`);
    }
  }, [paramSearchValue]);

  const handlePageJump = (i: number) => {
    setPage(i);
    setRefetchGetAllPartner(false);
    setIsLoading(true);

    setTimeout(() => {
      setRefetchGetAllPartner(true);
      setIsLoading(false);
    }, 1000);
  };

  const updateOnePartner = async () => {
    try {
      if (Object.keys(inputValues).length === 0) {
        setToast({
          showToast: true,
          toastMessage: 'Anda tidak melakukan perubahan apapun',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }
      const formData = new FormData();

      for (const key in inputValues) {
        formData.append(key, inputValues[key]);
      }

      if (
        inputValues['email'] &&
        !isEmailPattern(inputValues['email'] as string)
      ) {
        setToast({
          showToast: true,
          toastMessage: 'input email tidak sesuai format',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      if (
        inputValues['password'] &&
        !isPasswordPattern(inputValues['password'] as string)
      ) {
        setToast({
          showToast: true,
          toastMessage:
            'min 8 karakter, min 1 huruf besar, min 1 huruf kecil, min 1 angka',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/partners/${selectedIdPartner}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setToast({
        showToast: true,
        toastMessage: 'Berhasil edit partner',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      setRefetchGetAllPartner(false);
      setRefetchGetOnePartner(false);
      setIsLoading(true);
      setSelectedIdPartner(null);

      setTimeout(() => {
        setRefetchGetAllPartner(true);
        setIsLoading(false);
        setRefetchGetOnePartner(true);
      }, 1000);
      setIsModalEditPartnerOpen(false);
      setIsModalOpen(false);
      setInputValues({});
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      setToast({
        showToast: true,
        toastMessage: `Gagal edit partner : ${errorMessage}`,
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  const handleClickEditPartner = (id: number) => {
    setIsModalEditPartnerOpen(true);
    setIsModalOpen(true);
    setSelectedIdPartner(id);
  };

  const handlePrevPage = () => {
    if (page === 1) return;
    setPage(page - 1);
    setRefetchGetAllPartner(false);
    setIsLoading(true);

    setTimeout(() => {
      setRefetchGetAllPartner(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleNextPage = () => {
    if (page === dataGetAllPartnerResponse?.pagination.page_count) return;
    setPage(page + 1);
    setRefetchGetAllPartner(false);
    setIsLoading(true);

    setTimeout(() => {
      setRefetchGetAllPartner(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleClickCloseModal = () => {
    setIsModalEditPartnerOpen(false);
    setIsModalAddPartnerOpen(false);
    setIsModalOpen(false);
    setInputValues({});
    setPreviewUrl(null);
  };

  const handleClickAddPartner = () => {
    setIsModalOpen(true);
    setIsModalAddPartnerOpen(true);
  };

  const handleInputChange = (name: string, value: string | File) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleInputValueChange = (
    name: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleInputChange(name, event.target.value);
  };

  const handleInputValueFileChange = (
    name: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      handleInputChange(name, file);
    }
  };

  const handleClickLimit = () => {
    if (inputLimitValue !== '') {
      if (isNaN(parseInt(inputLimitValue)) || parseInt(inputLimitValue) <= 0) {
        setToast({
          showToast: true,
          toastMessage: 'input harus berupa angka dan positif',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      if (parseInt(inputLimitValue) > 25) {
        setToast({
          showToast: true,
          toastMessage: 'maksimum limit data adalah 25',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }
    }
    if (inputLimitValue === '') {
      setParamLimitValue(10);
    }
    if (inputLimitValue !== '') {
      setParamLimitValue(parseInt(inputLimitValue));
    }
    setRefetchGetAllPartner(false);
    setIsLoading(true);
    setPage(1);
    setTimeout(() => {
      setRefetchGetAllPartner(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleClickIconSearch = () => {
    setPage(1);
    setParamSearchValue(inputSearchValue);
  };

  const createOnePartner = async () => {
    try {
      const formData = new FormData();

      for (const key in inputValues) {
        formData.append(key, inputValues[key]);
      }

      if (
        inputValues['name'] == '' ||
        inputValues['logo'] == '' ||
        inputValues['email'] == '' ||
        inputValues['password'] == '' ||
        !inputValues['name'] ||
        !inputValues['logo'] ||
        !inputValues['email'] ||
        !inputValues['password']
      ) {
        setToast({
          showToast: true,
          toastMessage: 'semua input tidak boleh kosong',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      if (!isEmailPattern(inputValues['email'] as string)) {
        setToast({
          showToast: true,
          toastMessage: 'input email tidak sesuai format',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      if (!isPasswordPattern(inputValues['password'] as string)) {
        setToast({
          showToast: true,
          toastMessage:
            'min 8 karakter, min 1 huruf besar, min 1 huruf kecil, min 1 angka',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/partners`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setToast({
        showToast: true,
        toastMessage: 'Berhasil tambah partner',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      setRefetchGetAllPartner(false);
      setRefetchGetOnePartner(false);
      setIsLoading(true);
      setSelectedIdPartner(null);

      setTimeout(() => {
        setRefetchGetAllPartner(true);
        setIsLoading(false);
        setRefetchGetOnePartner(true);
      }, 1000);
      setIsModalAddPartnerOpen(false);
      setIsModalOpen(false);
      setInputValues({});
      setPreviewUrl(null);
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      if (errorMessage.includes('email is already register')) {
        setToast({
          showToast: true,
          toastMessage: 'email ini sudah digunakan',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }
      if (errorMessage.includes('partner already existed')) {
        setToast({
          showToast: true,
          toastMessage: 'nama partner sudah digunakan',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }
      if (errorMessage.includes('internal server')) {
        setToast({
          showToast: true,
          toastMessage: 'nama obat sudah digunakan pada partner lain',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }
      setToast({
        showToast: true,
        toastMessage: errorMessage,
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  const fetcherGetOnePartner = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

  const { data: dataOnePartner } = useSWR<IGetDetailPartnerResponse>(
    selectedIdPartner && refetchGetOnePartner
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/partners/${selectedIdPartner}`
      : null,
    fetcherGetOnePartner,
  );

  return (
    <>
      <div
        style={{
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Navbar />
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            gap: '15px',
            justifyContent: 'space-between',
            marginTop: '-25px',
            padding: '0 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '30%',
              height: '50px',
              gap: '5px',
              padding: '0 10px',
              alignItems: 'center',
              backgroundColor: '#dddddd',
            }}
          >
            <MagnifyBlueICO onClick={handleClickIconSearch} />
            <input
              value={inputSearchValue}
              onChange={(e) => setInputSearchValue(e.target.value)}
              style={{ padding: '10px', flexGrow: '1' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleClickIconSearch();
                }
              }}
            ></input>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div>Show</div>
            <div style={{ width: '30px' }}>
              <input
                style={{ width: '100%', padding: '5px' }}
                type='text'
                value={inputLimitValue?.toString()}
                onChange={(e) => setInputLimitValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleClickLimit();
                  }
                }}
              />
            </div>
            <div>Entries</div>
          </div>

          <div
            style={{
              padding: '10px',
              backgroundColor: '#00B5C0',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              display: 'flex',
              cursor: 'pointer',
            }}
            onClick={() => handleClickAddPartner()}
          >
            + Tambah Partner
          </div>
        </div>
        {isLoading || loadingGetAllDataPartner ? (
          <div
            style={{
              width: '100%',
              height: '75vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {' '}
            loading....
          </div>
        ) : (
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ height: '60px' }}>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Logo
                </th>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Nama
                </th>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {dataGetAllPartnerResponse?.data?.map(
                (item: IGetAllPartnerResponseData, index: number) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? 'rgba(0, 181, 192, 0.05)' : 'white',
                      height: '60px',
                      padding: '0 10px',
                    }}
                  >
                    <td
                      style={{
                        padding: '0 10px',
                        width: '10%',
                      }}
                    >
                      <Image
                        height={60}
                        width={60}
                        alt=''
                        src={item.logo_url || LogoPartner}
                      />
                    </td>
                    <td
                      style={{
                        padding: '0 10px',
                        width: '20%',
                      }}
                    >
                      {item.name}
                    </td>

                    <td
                      style={{
                        padding: '0 10px',
                        width: '10%',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          justifyContent: 'center',
                        }}
                      >
                        <EditIcon
                          onClick={() => handleClickEditPartner(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
        {dataGetAllPartnerResponse && dataGetAllPartnerResponse.pagination && (
          <PaginationDiv>
            <PaginationComponent
              page={dataGetAllPartnerResponse.pagination.page}
              totalPages={dataGetAllPartnerResponse.pagination.page_count}
              goToPage={handlePageJump}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
            />
          </PaginationDiv>
        )}

        {isModalOpen && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height: '70vh',
              width: '70vw',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '5px',
              boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
              zIndex: '10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '5%',
            }}
          >
            {isModalEditPartnerOpen && <h2>Edit partner</h2>}
            {isModalAddPartnerOpen && <h2>Add partner</h2>}
            {isModalAddPartnerOpen && (
              <div
                style={{ color: 'red', fontSize: '12px', textAlign: 'left' }}
              >
                **Semua input wajib diisi
              </div>
            )}

            <div
              style={{
                width: '90%',
                height: '50vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', gap: '10px' }}>
                <RegularInput
                  title='nama'
                  placeholder='Masukkan nama partner'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditPartnerOpen ? dataOnePartner?.data?.name : ''
                  }
                  onChange={(e) => handleInputValueChange('name', e)}
                  validationMessage={''}
                />
                <RegularInput
                  title='email partner'
                  placeholder='Masukkan email akun partner'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditPartnerOpen ? dataOnePartner?.data?.email : ''
                  }
                  onChange={(e) => handleInputValueChange('email', e)}
                  validationMessage={''}
                />
                <RegularInput
                  title='password'
                  placeholder='Masukkan password akun partner'
                  $height={80}
                  $marBot={0}
                  defaultValue={''}
                  onChange={(e) => handleInputValueChange('password', e)}
                  validationMessage={''}
                />
              </div>
              <div style={{ display: 'flex' }}>
                <RegularInput
                  type='file'
                  title='Upload logo partner'
                  placeholder='Pilih foto logo partner'
                  $width={45}
                  $height={35}
                  onChange={(e) => handleInputValueFileChange('logo', e)}
                  validationMessage={''}
                  $marBot={0}
                  accept='image/*'
                />
              </div>
              {previewUrl && (
                <Image
                  height={130}
                  width={130}
                  src={previewUrl}
                  alt='Preview Gambar'
                />
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                width: '100%',
                gap: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'red',
                  borderRadius: '6px',
                  boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
                  cursor: 'pointer',
                }}
                onClick={handleClickCloseModal}
              >
                Batal
              </div>
              {isModalEditPartnerOpen && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px 20px',
                    backgroundColor: '#00B5C0',
                    color: 'white',
                    borderRadius: '6px',
                    boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
                    cursor: 'pointer',
                  }}
                  onClick={updateOnePartner}
                >
                  Edit Partner
                </div>
              )}

              {isModalAddPartnerOpen && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '10px 20px',
                      backgroundColor: '#00B5C0',
                      color: 'white',
                      borderRadius: '6px',
                      boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.3)',
                      cursor: 'pointer',
                    }}
                    onClick={createOnePartner}
                  >
                    Tambah Partner
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PartnerPage;
