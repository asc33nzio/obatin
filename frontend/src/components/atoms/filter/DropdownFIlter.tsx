import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import CustomButton from '../button/CustomButton';

import {
  FilterButtonStyle,
  FilterContainer,
} from '@/styles/atoms/DropdownFilter.styles';

const FilterComponent = ({
  setSortBy,
  setClassification,
  setOrderBy,
  onClickClear,
  sortValue,
  orderValue,
  classificationValue,
}: {
  setSortBy: (sortBy: string | null) => void;
  setClassification: (classification: string | null) => void;
  setOrderBy: (orderBy: string | null) => void;
  onClickClear: () => void;
  sortValue: string | null;
  orderValue: string | null;
  classificationValue: string | null;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const [isOpenSortBy, setIsOpenSortBy] = useState(false);
  const [isOpenOrderBy, setIsOpenOrderBy] = useState(false);
  const [isOpenClassification, setIsOpenClassification] = useState(false);

  const handleSetSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.replace(`${pathName}?${params.toString()}`);
  };

  const toggleFilterSortBy = () => {
    setIsOpenSortBy(!isOpenSortBy);
  };
  const toggleFilterOrderBy = () => {
    setIsOpenOrderBy(!isOpenOrderBy);
  };
  const toggleFilterCllasification = () => {
    setIsOpenClassification(!isOpenClassification);
  };

  const handleSortByClicked = (sortBy: string) => {
    setSortBy(sortBy);
  };

  const handleClassificationClicked = (classification: string) => {
    setClassification(classification);
  };

  const handleOrderClicked = (order: string) => {
    setOrderBy(order);
  };

  return (
    <FilterContainer>
      <FilterButtonStyle>
        <CustomButton
          content={
            sortValue === 'name'
              ? 'Nama'
              : sortValue === 'price'
                ? 'Harga'
                : 'Urut berdasarkan'
          }
          onClick={toggleFilterSortBy}
          $fontSize='16px'
        />
        {isOpenSortBy && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              onClick={() => {
                handleSetSearchParams('sort_by', 'name');
                handleSortByClicked('name');
                setIsOpenSortBy(false);
              }}
            >
              Nama
            </button>
            <button
              onClick={() => {
                handleSetSearchParams('sort_by', 'price');
                handleSortByClicked('price');
                setIsOpenSortBy(false);
              }}
            >
              Harga
            </button>
          </div>
        )}
      </FilterButtonStyle>

      <FilterButtonStyle>
        <CustomButton
          content={
            classificationValue === 'obat_keras'
              ? 'Obat Keras'
              : classificationValue === 'obat_bebas'
                ? 'Obat Bebas'
                : classificationValue === 'obat_bebas_terbatas'
                  ? 'Obat Bebas Terbatas'
                  : classificationValue === 'non_obat'
                    ? 'Non Obat'
                    : 'Klasifikasi'
          }
          onClick={toggleFilterCllasification}
          $fontSize='16px'
        />
        {isOpenClassification && (
          <div>
            <button
              onClick={() => {
                handleSetSearchParams('classification', 'obat_keras');
                handleClassificationClicked('obat_keras');
                setIsOpenClassification(false);
              }}
            >
              Obat Keras
            </button>
            <button
              onClick={() => {
                handleSetSearchParams('classification', 'obat_bebas');
                handleClassificationClicked('obat_bebas');
                setIsOpenClassification(false);
              }}
            >
              Obat Bebas
            </button>
            <button
              onClick={() => {
                handleSetSearchParams('classification', 'obat_bebas_terbatas');
                handleClassificationClicked('obat_bebas_terbatas');
                setIsOpenClassification(false);
              }}
            >
              Obat Bebas Terbatas
            </button>
            <button
              onClick={() => {
                handleSetSearchParams('classification', 'non_obat');
                handleClassificationClicked('non_obat');
                setIsOpenClassification(false);
              }}
            >
              Non Obat
            </button>
          </div>
        )}
      </FilterButtonStyle>

      <FilterButtonStyle>
        <CustomButton
          content={
            orderValue === 'desc'
              ? 'Atas ke bawah'
              : orderValue === 'asc'
                ? 'Bawah ke atas'
                : 'Urutan'
          }
          onClick={toggleFilterOrderBy}
          $fontSize='16px'
        />
        {isOpenOrderBy && (
          <div>
            <button
              onClick={() => {
                handleSetSearchParams('order', 'asc');
                handleOrderClicked('asc');
                setIsOpenOrderBy(false);
              }}
            >
              Dari bawah ke atas
            </button>
            <button
              onClick={() => {
                handleSetSearchParams('order', 'desc');
                handleOrderClicked('desc');
                setIsOpenOrderBy(false);
              }}
            >
              Dari atas ke bawah
            </button>
          </div>
        )}
      </FilterButtonStyle>

      <CustomButton
        content='Clear Filter'
        $width='200px'
        $height='50px'
        $fontSize='16px'
        onClick={() => {
          onClickClear();
          setIsOpenOrderBy(false);
          setIsOpenSortBy(false);
          setIsOpenClassification(false);
        }}
      />
    </FilterContainer>
  );
};

export default FilterComponent;
