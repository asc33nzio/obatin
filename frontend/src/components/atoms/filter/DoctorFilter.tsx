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
}: {
  setSortBy: (sortBy: string | null) => void;
  setOrderBy: (orderBy: string | null) => void;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
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

    const queryString = newParams.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <FilterContainer>
      <FilterButtonStyle>
        <CustomButton
          content='Sort By'
          onClick={toggleFilter}
          $fontSize='16px'
        />
        {isOpen && (
          <div>
            <button
              onClick={() => {
                handleFilterClicked('sort_by', 'name');
                handleSortByClicked('name');
              }}
            >
              Nama
            </button>
            <button
              onClick={() => {
                handleFilterClicked('is_online', 'true');
                handleSortByClicked('true');
              }}
            >
              Online
            </button>
          </div>
        )}
      </FilterButtonStyle>

      <FilterButtonStyle>
        <CustomButton
          content='Order By'
          onClick={toggleFilter}
          $fontSize='16px'
        />
        {isOpen && (
          <div>
            <button
              onClick={() => {
                handleFilterClicked('order', 'asc');
                handleOrderClicked('asc');
              }}
            >
              Dari bawah ke atas
            </button>
            <button
              onClick={() => {
                handleFilterClicked('order', 'desc');
                handleOrderClicked('desc');
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
          toggleFilter();
        }}
      />
    </FilterContainer>
  );
};

export default DoctorFilterComponent;
