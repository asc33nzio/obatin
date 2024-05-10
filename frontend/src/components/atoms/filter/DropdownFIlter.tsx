import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
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
  const newParams = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();

  const [isOpenSortBy, setIsOpenSortBy] = useState(false);
  const [isOpenOrderBy, setIsOpenOrderBy] = useState(false);
  const [isOpenClassification, setIsOpenClassification] = useState(false);

  const toggleFilterSortBy = () => {
    setIsOpenSortBy(!isOpenSortBy);
  };
  const toggleFilterOrderBy = () => {
    setIsOpenOrderBy(!isOpenOrderBy);
  };
  const toggleFilterCllasification = () => {
    setIsOpenClassification(!isOpenClassification);
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleFilterClicked = useCallback(
    (name: string, value: string) => {
      const currentFilter = newParams.get(name);
      if (currentFilter === value) {
        newParams.delete(name);
      } else {
        newParams.set(name, value);
      }
      router.push(pathname + '?' + createQueryString(name, `${value}`));
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, newParams],
  );

  const handleSortByClicked = (sortBy: string) => {
    setSortBy(sortBy);
  };

  const handleClassificationClicked = (classification: string) => {
    setClassification(classification);
  };

  const handleOrderClicked = (order: string) => {
    setOrderBy(order);
  };

  const handleClearClicked = () => {
    newParams.delete('sort_by');
    newParams.delete('classification');
    newParams.delete('order');
    setSortBy(null);
    setClassification(null);
    setOrderBy(null);
    onClickClear();

    const queryString = newParams.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
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
                handleFilterClicked('sort_by', 'name');
                handleSortByClicked('name');
                setIsOpenSortBy(false);
              }}
            >
              Nama
            </button>
            <button
              onClick={() => {
                handleFilterClicked('sort_by', 'price');
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
                handleFilterClicked('classification', 'obat_keras');
                handleClassificationClicked('obat_keras');
                setIsOpenClassification(false);
              }}
            >
              Obat Keras
            </button>
            <button
              onClick={() => {
                handleFilterClicked('classification', 'obat_bebas');
                handleClassificationClicked('obat_bebas');
                setIsOpenClassification(false);
              }}
            >
              Obat Bebas
            </button>
            <button
              onClick={() => {
                handleFilterClicked('classification', 'obat_bebas_terbatas');
                handleClassificationClicked('obat_bebas_terbatas');
                setIsOpenClassification(false);
              }}
            >
              Obat Bebas Terbatas
            </button>
            <button
              onClick={() => {
                handleFilterClicked('classification', 'non_obat');
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
                handleFilterClicked('order', 'asc');
                handleOrderClicked('asc');
                setIsOpenOrderBy(false);
              }}
            >
              Dari bawah ke atas
            </button>
            <button
              onClick={() => {
                handleFilterClicked('order', 'desc');
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
        $width='150px'
        $height='50px'
        $fontSize='16px'
        onClick={() => {
          handleClearClicked();
          setIsOpenOrderBy(false);
          setIsOpenSortBy(false);
          setIsOpenClassification(false);
          // toggleFilter();
        }}
      />
    </FilterContainer>
  );
};

export default FilterComponent;
