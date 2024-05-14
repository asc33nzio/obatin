import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import CustomButton from '../button/CustomButton';

import {
  FilterButtonStyle,
  FilterContainer,
} from '@/styles/atoms/DropdownFilter.styles';

const DoctorFilterComponent = ({
  setSortBy,
  setOrderBy,
  onClickClear,
  sortValue,
  orderValue,
}: {
  setSortBy: (sortBy: string | null) => void;
  setOrderBy: (orderBy: string | null) => void;
  onClickClear: () => void;
  sortValue: string | null;
  orderValue: string | null;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();

  const [isOpenSortBy, setIsOpenSortBy] = useState(false);
  const [isOpenOrderBy, setIsOpenOrderBy] = useState(false);

  const toggleFilterSortBy = () => {
    setIsOpenSortBy(!isOpenSortBy);
  };
  const toggleFilterOrderBy = () => {
    setIsOpenOrderBy(!isOpenOrderBy);
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

    // eslint-disable-next-line
    [router, newParams],
  );

  const handleSortByClicked = (sortBy: string) => {
    setSortBy(sortBy);
  };

  const handleOrderClicked = (order: string) => {
    setOrderBy(order);
  };

  const handleClearClicked = () => {
    newParams.delete('sort_by');
    newParams.delete('is_online');
    newParams.delete('order');
    setSortBy(null);
    setOrderBy(null);
    onClickClear();
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
              : sortValue === 'true'
                ? 'Online'
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
                setIsOpenSortBy(false);
              }}
            >
              Nama
            </button>
            <button
              onClick={() => {
                handleFilterClicked('is_online', 'true');
                handleSortByClicked('true');
                setIsOpenSortBy(false);
              }}
            >
              Online
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
        content='Hapus filter'
        $width='150px'
        $height='50px'
        $fontSize='14px'
        onClick={() => {
          handleClearClicked();
          setIsOpenOrderBy(false);
          setIsOpenSortBy(false);
        }}
      />
    </FilterContainer>
  );
};

export default DoctorFilterComponent;
