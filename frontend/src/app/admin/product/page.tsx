'use client';
import Navbar from '@/components/organisms/navbar/Navbar';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import EditIcon from '@/assets/admin/EditIcon';
import MagnifyBlueICO from '@/assets/icons/MagnifyBlueICO';
import Image from 'next/image';
import RegularInput from '@/components/atoms/input/RegularInput';
// import DropdownAdmin from '@/components/molecules/admin/Dropdown';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useToast } from '@/hooks/useToast';
import Pagination from '@/components/molecules/admin/Pagination';
import {
  IDataProduct,
  IResponseGetAllManufacture,
  IResponseGetAllProduct,
  IResponseGetDetailProduct,
} from '@/types/Product';
import DropdownTest from '@/components/molecules/admin/DropdownTest';
import DropdownAdmin from '@/components/molecules/admin/Dropdown';
// import CascadeDropdown from '@/components/molecules/admin/DropdownCascade';

export interface ICategoryResponse {
  message: string;
  data: ICategoryDataResponse[];
}

export interface ICategoryDataResponse {
  id: number;
  name: string;
  category_slug: string;
  image_url: string;
  has_child: boolean;
  category_level: number;
  children?: ICategoryDataResponse[];
  parentId?: number;
}

function AdminProduct() {
  const [isModalEditProductOpen, setIsModalEditProductOpen] =
    useState<boolean>(false);
  const [isModalAddProductOpen, setIsModalAddProductOpen] =
    useState<boolean>(false);
  const [selectedSlugProduct, setSelectedSlugProduct] = useState<string | null>(
    null,
  );

  const [isModalManufactureOpen, setIsModalManufactureOpen] =
    useState<boolean>(false);
  const handleClickCloseModal = () => {
    setIsModalEditProductOpen(false);
    setIsModalAddProductOpen(false);
    setIsModalOpen(false);
    setInputValues({});
    setPreviewUrl(null);
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [paramsState, setParamsState] = useState<string | null>(null);

  const [refetchProduct, setRefetchProduct] = useState<boolean>(true);
  const [refetchOneProduct, setRefetchOneProduct] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  interface IOptionsDropdown {
    value: string;
    label: string;
  }

  const options: IOptionsDropdown[] = [
    { value: 'true', label: 'true' },
    { value: 'false', label: 'false' },
  ];

  const optionsClassifications: IOptionsDropdown[] = [
    { value: 'obat_keras', label: 'obat_keras' },
    { value: 'obat_bebas', label: 'obat_bebas' },
    { value: 'obat_bebas_terbatas', label: 'obat_bebas_terbatas' },
  ];

  // const convertBackendResponseToOptions = (data: ICategoryDataResponse[]) => {
  //   const options: IOptionsDropdown[] = [];

  //   data?.forEach((category) => {
  //     const categoryOption = {
  //       value: category.category_slug,
  //       label: category.name,
  //       children: category.children,
  //     };

  //     if (category?.children && category?.children?.length > 0) {
  //       const childrenOptions: IOptionsDropdown[] = [];

  //       category?.children?.forEach((child) => {
  //         const childOption: IOptionsDropdown = {
  //           value: child.id.toString(),
  //           label: child.name,
  //         };
  //         childrenOptions.push(childOption);
  //       });

  //       categoryOption.children = childrenOptions;
  //     }

  //     options.push(categoryOption);
  //   });

  //   console.log('FRANKYYYY', options);
  //   return options;
  // };

  const handleSelectType = (objectKey: string, value: any) => {
    handleInputChange(objectKey, value);
  };

  const [inputValues, setInputValues] = useState<{
    [key: string]: string | Blob;
  }>({});
  const [inputSearchValue, setInputSearchValue] = useState<string>('');
  const [paramSearchValue, setParamSearchValue] = useState<string | null>(null);

  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  const [inputLimitValue, setInputLimitValue] = useState<string>('');
  const [paramLimitValue, setParamLimitValue] = useState<number | null>(null);

  useEffect(() => {
    setSelectedPage(1);
    setParamLimitValue(10);
  }, []);

  const [selectedPageManufacturers, setSelectedPageManufacturers] =
    useState<number>(1);

  const handleClickPageManufacturers = (page: number) => {
    setSelectedPageManufacturers(page);
  };

  const handleClickPage = (page: number) => {
    setSelectedPage(page);
    setRefetchProduct(false);
    setIsLoading(true);

    setTimeout(() => {
      setRefetchProduct(true);
      setIsLoading(false);
    }, 1000);
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
    setRefetchProduct(false);
    setIsLoading(true);
    setSelectedPage(1);
    setTimeout(() => {
      setRefetchProduct(true);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (paramSearchValue?.trim() === '') {
      setParamsState('');
    } else {
      setParamsState(`search=${paramSearchValue}`);
    }
  }, [paramSearchValue]);

  const accessToken = getCookie('access_token');

  const { isDesktopDisplay } = useClientDisplayResolution();

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

  const handleInputValueChange = (
    name: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleInputChange(name, event.target.value);
  };

  const { setToast } = useToast();

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

  const handleInputChange = (name: string, value: string | File) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleClickEditProduct = (slug: string) => {
    setIsModalEditProductOpen(true);
    setIsModalOpen(true);
    setSelectedSlugProduct(slug);
  };

  const handleClickAddProduct = () => {
    setIsModalOpen(true);
    setIsModalAddProductOpen(true);
  };

  const fetcherGetProduct = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

  const {
    data: dataProduct,
    error: errorGetProduct,
    isLoading: loadingGetDataProduct,
  } = useSWR<IResponseGetAllProduct>(
    refetchProduct
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/products?page=${selectedPage}&${paramsState}&limit=${paramLimitValue}`
      : null,
    fetcherGetProduct,
  );

  const fetcherGetManufacturers = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

  const { data: dataManufacturers, error: errorGetManufacturers } =
    useSWR<IResponseGetAllManufacture>(
      isModalManufactureOpen
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/manufacturers?page=${selectedPageManufacturers}`
        : null,
      fetcherGetManufacturers,
    );

  const [selectedCategoryId, setSelectedCategoryId] = useState<number[]>([]);
  const onChangeCategory = (categoryId: number | null) => {
    if (categoryId) {
      const index = selectedCategoryId.indexOf(categoryId);
      if (index === -1) {
        setSelectedCategoryId([...selectedCategoryId, categoryId]);
      } else {
        const updatedCategoryIds = [...selectedCategoryId];
        updatedCategoryIds.splice(index, 1);
        setSelectedCategoryId(updatedCategoryIds);
      }
    }
  };

  const fetcherGetCategory = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

  const { data: dataCategory, error: errorGetCategory } =
    useSWR<ICategoryResponse>(
      isModalEditProductOpen || isModalAddProductOpen
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/categories`
        : null,
      fetcherGetCategory,
      // { refreshInterval: 5000 },
    );

  // if (dataCategory) {
  // const optionsCategory = convertBackendResponseToOptions(dataCategory?.data);

  //   setDataCategoryConvert(optionsCategory);
  // setSimpanDataCategory(dataCategory);
  // }

  // const handleDropdownChange = (value) => {
  //   console.log('Selected value:', value);
  // };

  const fetcherGetOneProduct = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

  const { data: dataOneProduct, error: errorGetOneProduct } =
    useSWR<IResponseGetDetailProduct>(
      selectedSlugProduct && refetchOneProduct
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/products/${selectedSlugProduct}`
        : null,
      fetcherGetOneProduct,
    );

  // const { data } = useSWR(shouldFetch ? '/api/data' : null, fetcher)

  function formatRupiah(data: number) {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });

    return formatter.format(data);
  }

  const updateOneProduct = async () => {
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
      // await axios.patch(
      //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/products/${selectedSlugProduct}`,
      //   formData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   },
      // );
      setToast({
        showToast: true,
        toastMessage: 'Berhasil edit produk',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      setRefetchProduct(false);
      setRefetchOneProduct(false);
      setIsLoading(true);
      setSelectedSlugProduct(null);

      setTimeout(() => {
        setRefetchProduct(true);
        setIsLoading(false);
        setRefetchOneProduct(true);
      }, 1000);
      setIsModalEditProductOpen(false);
      setIsModalOpen(false);
      setInputValues({});
    } catch (error) {
      setToast({
        showToast: true,
        toastMessage: 'Gagal edit produk',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      console.error(error);
    }
  };

  function validateNumber(value: any) {
    if (typeof value === 'string' && value.trim() !== '') {
      return !isNaN(parseFloat(value));
    } else {
      return false;
    }
  }

  const createOneProduct = async () => {
    try {
      const formData = new FormData();

      for (const key in inputValues) {
        formData.append(key, inputValues[key]);
      }

      const selectedCategoryIdString = selectedCategoryId.join(',');
      formData.append('categories', selectedCategoryIdString);
      console.log(formData);
      if (
        inputValues['name'] == '' ||
        inputValues['min_price'] == '' ||
        inputValues['max_price'] == '' ||
        inputValues['product_slug'] == '' ||
        inputValues['generic_name'] == '' ||
        inputValues['classification'] == '' ||
        inputValues['weight'] == '' ||
        inputValues['image'] == '' ||
        inputValues['is_active'] == '' ||
        inputValues['is_prescription_required'] == '' ||
        inputValues['categories'] == '' ||
        !inputValues['name'] ||
        !inputValues['min_price'] ||
        !inputValues['max_price'] ||
        !inputValues['product_slug'] ||
        !inputValues['generic_name'] ||
        !inputValues['classification'] ||
        !inputValues['weight'] ||
        !inputValues['image']
      ) {
        setToast({
          showToast: true,
          toastMessage: 'input wajib tidak boleh kosong',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      if (
        !validateNumber(inputValues['min_price']) ||
        !validateNumber(inputValues['max_price']) ||
        !validateNumber(inputValues['width']) ||
        !validateNumber(inputValues['height']) ||
        !validateNumber(inputValues['length']) ||
        !validateNumber(inputValues['weight'])
      ) {
        setToast({
          showToast: true,
          toastMessage:
            'input berat, panjang, lebar, tinggi, dan harga harus berupa angka dan positif',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/products`,
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
        toastMessage: 'Berhasil tambah produk',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      setRefetchProduct(false);
      setRefetchOneProduct(false);
      setIsLoading(true);
      setSelectedSlugProduct(null);

      setTimeout(() => {
        setRefetchProduct(true);
        setIsLoading(false);
        setRefetchOneProduct(true);
      }, 1000);
      setIsModalAddProductOpen(false);
      setIsModalOpen(false);
      setInputValues({});
    } catch (error) {
      setToast({
        showToast: true,
        toastMessage: 'Gagal tambah produk',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(errorGetProduct);
  }, [errorGetProduct]);

  useEffect(() => {
    console.log(errorGetManufacturers);
  }, [errorGetManufacturers]);

  useEffect(() => {
    console.log(errorGetOneProduct);
  }, [errorGetOneProduct]);

  useEffect(() => {
    console.log(errorGetCategory);
  }, [errorGetCategory]);

  const handleClickIconSearch = () => {
    setSelectedPage(1);
    setParamSearchValue(inputSearchValue);
  };

  const handleClickOpenManufacture = async () => {
    setIsModalManufactureOpen(true);
  };

  return (
    <>
      <div
        style={{
          width: '100vw',
          height: '100vh',
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
              // onChange={(e) => e.target.value}
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
            onClick={() => handleClickAddProduct()}
          >
            + Tambah obat
          </div>
        </div>
        {isLoading || loadingGetDataProduct ? (
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
                  Gambar
                </th>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Nama
                </th>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Slug Produk
                </th>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Unit Penjualan
                </th>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Harga Minimum
                </th>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Harga Maksimum
                </th>
                <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {dataProduct?.data?.map((item: IDataProduct, index: number) => (
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
                      width: '',
                    }}
                  >
                    <Image height={60} width={60} alt='' src={item.image_url} />
                  </td>
                  <td
                    style={{
                      padding: '0 10px',
                    }}
                  >
                    {item.name}
                  </td>
                  <td
                    style={{
                      padding: '0 10px',
                    }}
                  >
                    {item.product_slug}
                  </td>
                  <td
                    style={{
                      padding: '0 10px',
                    }}
                  >
                    {item.selling_unit}
                  </td>
                  <td
                    style={{
                      padding: '0 10px',
                    }}
                  >
                    {formatRupiah(item.min_price)}
                  </td>
                  <td
                    style={{
                      padding: '0 10px',
                    }}
                  >
                    {formatRupiah(item.max_price)}
                  </td>

                  <td
                    style={{
                      padding: '0 10px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <EditIcon
                        onClick={() =>
                          handleClickEditProduct(item.product_slug)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* </div> */}

        {!isLoading && dataProduct && dataProduct.pagination && (
          <div style={{ padding: '30px 0' }}>
            <Pagination
              currentPage={dataProduct.pagination.page}
              totalPages={dataProduct.pagination.page_count}
              onPageChange={(page) => handleClickPage(page)}
            />
          </div>
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
            {isModalEditProductOpen && <h2>Edit product</h2>}
            {isModalAddProductOpen && <h2>Add product</h2>}
            {isModalAddProductOpen && (
              <div
                style={{ color: 'red', fontSize: '12px', textAlign: 'left' }}
              >
                **Beberapa input ini wajib diisi : nama, harga maks, harga min,
                produk slug, nama generik, klasifikasi, berat, gambar, apakah
                aktif, apakah butuh resep, dan minimal 1 categori
              </div>
            )}

            {/* {selectedSlugProduct} */}
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
                  placeholder='Masukkan nama produk'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen ? dataOneProduct?.data?.name : ''
                  }
                  onChange={(e) => handleInputValueChange('name', e)}
                  validationMessage={''}
                />
                <RegularInput
                  title='harga minimum'
                  placeholder='Masukkan minimum harga'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen
                      ? dataOneProduct?.data?.min_price
                      : ''
                  }
                  onChange={(e) => handleInputValueChange('min_price', e)}
                  validationMessage={''}
                />
                <RegularInput
                  title='harga maksimal'
                  placeholder='Masukkan harga maksimal'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen
                      ? dataOneProduct?.data?.max_price
                      : ''
                  }
                  onChange={(e) => handleInputValueChange('max_price', e)}
                  validationMessage={''}
                />
              </div>
              <div style={{ display: 'flex' }}>
                <RegularInput
                  title='slug'
                  placeholder='Masukkan slug produk'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen
                      ? dataOneProduct?.data?.product_slug
                      : ''
                  }
                  onChange={(e) => handleInputValueChange('product_slug', e)}
                  validationMessage={''}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <RegularInput
                  title='nama generik'
                  placeholder='Masukkan nama generik'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen
                      ? dataOneProduct?.data?.generic_name
                      : ''
                  }
                  onChange={(e) => handleInputValueChange('generic_name', e)}
                  validationMessage={''}
                />
                <RegularInput
                  title='indikasi umum'
                  placeholder='Masukkan indikasi umum'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen
                      ? dataOneProduct?.data?.general_indication
                      : ''
                  }
                  onChange={(e) =>
                    handleInputValueChange('general_indication', e)
                  }
                  validationMessage={''}
                />
                <RegularInput
                  title='dosis'
                  placeholder='Masukkan deskripsi dosis'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen ? dataOneProduct?.data?.dosage : ''
                  }
                  onChange={(e) => handleInputValueChange('dosage', e)}
                  validationMessage={''}
                />
              </div>
              <div>
                <RegularInput
                  title='cara penggunaan'
                  placeholder='Masukkan deskripsi penggunaan'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen
                      ? dataOneProduct?.data?.description
                      : ''
                  }
                  onChange={(e) => handleInputValueChange('description', e)}
                  validationMessage={''}
                />
              </div>
              <div>
                <RegularInput
                  title='efek samping'
                  placeholder='Masukkan deskripsi efek samping'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen
                      ? dataOneProduct?.data?.side_effects
                      : ''
                  }
                  onChange={(e) => handleInputValueChange('side_effects', e)}
                  validationMessage={''}
                />
              </div>
              <div>
                <RegularInput
                  title='kontra-indikasi'
                  placeholder='Masukkan deskripsi kontra-indikasi'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen
                      ? dataOneProduct?.data?.contraindication
                      : ''
                  }
                  onChange={(e) =>
                    handleInputValueChange('contraindication', e)
                  }
                  validationMessage={''}
                />
              </div>
              <div>
                <RegularInput
                  title='peringatan'
                  placeholder='Masukkan deskripsi peringatan'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen ? dataOneProduct?.data?.warning : ''
                  }
                  onChange={(e) => handleInputValueChange('warning', e)}
                  validationMessage={''}
                />
              </div>
              <div>
                <RegularInput
                  title='nomor BPOM'
                  placeholder='Masukkan nomor BPOM'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen
                      ? dataOneProduct?.data?.bpom_number
                      : ''
                  }
                  onChange={(e) => handleInputValueChange('bpom_number', e)}
                  validationMessage={''}
                />
              </div>
              <div>
                <RegularInput
                  title='kandungan obat'
                  placeholder='Masukkan komposisi kandungan'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen ? dataOneProduct?.data?.content : ''
                  }
                  onChange={(e) => handleInputValueChange('content', e)}
                  validationMessage={''}
                />
              </div>
              <div>
                <RegularInput
                  title='deskripsi'
                  placeholder='Masukkan deskripsi'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen
                      ? dataOneProduct?.data?.description
                      : ''
                  }
                  onChange={(e) => handleInputValueChange('description', e)}
                  validationMessage={''}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <RegularInput
                  title='isi per kemasan'
                  placeholder='Masukkan isi per kemasan'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen
                      ? dataOneProduct?.data?.packaging
                      : ''
                  }
                  onChange={(e) => handleInputValueChange('packaging', e)}
                  validationMessage={''}
                />
                <RegularInput
                  title='unit penjualan'
                  placeholder='Masukkan unit penjualan'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen
                      ? dataOneProduct?.data?.selling_unit
                      : ''
                  }
                  onChange={(e) => handleInputValueChange('selling_unit', e)}
                  validationMessage={''}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <RegularInput
                  title='berat obat'
                  placeholder='Masukkan berat (gram)'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen ? dataOneProduct?.data?.weight : ''
                  }
                  onChange={(e) => handleInputValueChange('weight', e)}
                  validationMessage={''}
                />
                <RegularInput
                  title='tinggi obat'
                  placeholder='Masukkan tinggi (cm)'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen ? dataOneProduct?.data?.height : ''
                  }
                  onChange={(e) => handleInputValueChange('height', e)}
                  validationMessage={''}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <RegularInput
                  title='panjang obat'
                  placeholder='Masukkan panjang (cm)'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen ? dataOneProduct?.data?.length : ''
                  }
                  onChange={(e) => handleInputValueChange('length', e)}
                  validationMessage={''}
                />
                <RegularInput
                  title='lebar obat'
                  placeholder='Masukkan lebar (cm)'
                  $height={80}
                  $marBot={0}
                  defaultValue={
                    isModalEditProductOpen ? dataOneProduct?.data?.width : ''
                  }
                  onChange={(e) => handleInputValueChange('width', e)}
                  validationMessage={''}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    width: '50%',
                  }}
                >
                  <div>Apakah Obat Aktif ?</div>
                  <DropdownTest
                    options={options}
                    placeholder='obat aktif ?'
                    onChange={(e) => handleSelectType('is_active', e)}
                    fontColor='black'
                    fontWeight='500'
                    background='#eaeaea'
                    backgroundOnHover='#ddc8cb'
                    backgroundOption='#EDE6E7'
                    fontSize='15px'
                    padding='10px'
                    borderRadius='5px'
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    width: '50%',
                  }}
                >
                  <div>Apakah butuh resep?</div>
                  <DropdownTest
                    options={options}
                    placeholder='butuh resep ?'
                    onChange={(e) =>
                      handleSelectType('is_prescription_required', e)
                    }
                    fontColor='black'
                    fontWeight='500'
                    background='#eaeaea'
                    backgroundOnHover='#ddc8cb'
                    backgroundOption='#EDE6E7'
                    fontSize='15px'
                    padding='10px'
                    borderRadius='5px'
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    width: '50%',
                  }}
                >
                  <div>Klasifikasi Obat</div>
                  <DropdownTest
                    options={optionsClassifications}
                    placeholder='klasifikasi obat ?'
                    onChange={(e) => handleSelectType('classification', e)}
                    fontColor='black'
                    fontWeight='500'
                    background='#eaeaea'
                    backgroundOnHover='#ddc8cb'
                    backgroundOption='#EDE6E7'
                    fontSize='15px'
                    padding='10px'
                    borderRadius='5px'
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                {isModalAddProductOpen && (
                  <div>
                    <RegularInput
                      title='masukkan manufacture id'
                      placeholder='manufacture id'
                      $height={80}
                      $marBot={0}
                      onChange={(e) =>
                        handleInputValueChange('manufacturer_id', e)
                      }
                      validationMessage={''}
                    />
                  </div>
                )}
                <div
                  style={{
                    padding: '15px',
                    backgroundColor: '#00B5C0',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    display: 'flex',
                    cursor: 'pointer',
                    height: '20%',
                    alignSelf: 'center',
                  }}
                  onClick={() => handleClickOpenManufacture()}
                >
                  Lihat manufaktur
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <RegularInput
                  type='file'
                  title='Upload foto obat'
                  placeholder='Pilih Foto'
                  $width={45}
                  $height={35}
                  onChange={(e) => handleInputValueFileChange('image', e)}
                  validationMessage={''}
                  $marBot={0}
                  accept='image/*'
                />
                {previewUrl && (
                  <Image
                    height={130}
                    width={130}
                    src={previewUrl}
                    alt='Preview Gambar'
                  />
                )}
              </div>
              {/*{dataCategory && (
                <CascadeDropdown
                  options={convertBackendResponseToOptions(dataCategory?.data)}
                  onChange={(e) => handleSelectType('testt', e)}
                />
              )}

              {/* {JSON.stringify(
                convertBackendResponseToOptions(dataCategory?.data),
              )} */}
              {dataCategory && (
                <DropdownAdmin
                  data={dataCategory?.data}
                  onChangeFromDropdown={onChangeCategory}
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
              {isModalEditProductOpen && (
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
                  onClick={updateOneProduct}
                >
                  Edit Produk
                </div>
              )}

              {isModalAddProductOpen && (
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
                    onClick={createOneProduct}
                  >
                    Tambah Produk
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {isModalManufactureOpen && (
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
            <div>List Data Manufakturer</div>
            <table style={{ width: '100%' }}>
              <thead>
                <tr style={{ height: '30px' }}>
                  <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                    Name
                  </th>
                  <th style={{ backgroundColor: '#00B5C0', color: 'white' }}>
                    id
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataManufacturers?.data?.map((item, index: number) => (
                  <tr
                    key={`${item.id}_${index}`}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? 'rgba(0, 181, 192, 0.05)' : 'white',
                      height: '30px',
                      padding: '0 10px',
                    }}
                  >
                    <td
                      style={{
                        padding: '0 5px',
                      }}
                    >
                      {item.manufacturer_name}
                    </td>
                    <td
                      style={{
                        padding: '0 5px',
                      }}
                    >
                      {item.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!isLoading &&
              dataManufacturers &&
              dataManufacturers.pagination && (
                <div style={{ padding: '30px 0' }}>
                  <Pagination
                    currentPage={dataManufacturers?.pagination?.page}
                    totalPages={dataManufacturers?.pagination?.page_count}
                    onPageChange={(page) => handleClickPageManufacturers(page)}
                  />
                </div>
              )}
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
              onClick={() => setIsModalManufactureOpen(false)}
            >
              Tutup
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminProduct;
