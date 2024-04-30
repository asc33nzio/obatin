import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  FilterButtonStyle,
  FilterContainer,
} from '@/styles/atoms/DropdownFilter.styles';
import CustomButton from '../button/CustomButton';

const FilterComponent = ({
  setSortBy,
  setClassification,
  setOrderBy,
}: {
  setSortBy: (sortBy: string | null) => void;
  setClassification: (classification: string | null) => void;
  setOrderBy: (orderBy: string | null) => void;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();

  const handleSortBy = useCallback(
    (sortBy: string) => {
      const currentSort = newParams.get('sort_by');
      if (currentSort === sortBy) {
        newParams.delete('sort_by');
      } else {
        newParams.set('sort_by', sortBy);
      }
      router.push(pathname + '?' + createQueryString('sort_by', `${sortBy}`));
    },
    // eslint-disable-next-line
    [router, newParams],
  );

  const handleClassification = useCallback(
    (classification: string) => {
      const currentClassification = newParams.get('classification');
      if (currentClassification === classification) {
        newParams.delete('classification');
      } else {
        newParams.set('classification', classification);
      }
      router.push(
        pathname +
          '?' +
          createQueryString('classification', `${classification}`),
      );
    },
    // eslint-disable-next-line
    [router, newParams],
  );

  const handleOrder = useCallback(
    (order: string) => {
      const currentOrder = newParams.get('order');
      if (currentOrder === order) {
        newParams.delete('order');
      } else {
        newParams.set('order', order);
      }
      router.push(pathname + '?' + createQueryString('order', `${order}`));
    },
    // eslint-disable-next-line
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
    setSortBy(null);
    setClassification(null);
    setOrderBy(null);
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <FilterContainer>
      <FilterButtonStyle>
        <button
          onClick={() => {
            handleSortBy('name');
            handleSortByClicked('name');
          }}
        >
          Nama
        </button>
        <button
          onClick={() => {
            handleSortBy('price');
            handleSortByClicked('price');
          }}
        >
          Harga
        </button>
      </FilterButtonStyle>

      <FilterButtonStyle>
        <button
          onClick={() => {
            handleClassification('obat_keras');
            handleClassificationClicked('obat_keras');
          }}
        >
          Obat Keras
        </button>
        <button
          onClick={() => {
            handleClassification('obat_bebas');
            handleClassificationClicked('obat_bebas');
          }}
        >
          Obat Bebas
        </button>
        <button
          onClick={() => {
            handleClassification('obat_bebas_terbatas');
            handleClassificationClicked('obat_bebas_terbatas');
          }}
        >
          Obat Bebas Terbatas
        </button>
        <button
          onClick={() => {
            handleClassification('non_obat');
            handleClassificationClicked('non_obat');
          }}
        >
          Non Obat
        </button>
      </FilterButtonStyle>

      <FilterButtonStyle>
        <button
          onClick={() => {
            handleOrder('asc');
            handleOrderClicked('asc');
          }}
        >
          Dari bawah ke atas
        </button>
        <button
          onClick={() => {
            handleOrder('desc');
            handleOrderClicked('desc');
          }}
        >
          Dari atas ke bawah
        </button>
      </FilterButtonStyle>
      <CustomButton
        content='hapus filter'
        $width='150px'
        $height='50px'
        $fontSize='16px'
        onClick={() => handleClearClicked}
      />
    </FilterContainer>
  );
};

export default FilterComponent;
