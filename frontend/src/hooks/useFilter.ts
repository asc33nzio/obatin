import { useDebouncedValue } from '@mantine/hooks';
// import { useRouter } from 'next/router';
import { useState } from 'react';

export const useFilter = () => {
  //   const { query } = useRouter();

  const [name, setName] = useState<string[]>([]);
  const [price, setPrice] = useState<string[]>([]);

  const [ObatKeras, setObatKeras] = useState<string[]>([]);
  const [ObatBebas, setObatBebas] = useState<string[]>([]);
  const [ObatBebasTerbatas, setObatBebasTerbatas] = useState<string[]>([]);
  const [NonObat, setNonObat] = useState<string[]>([]);

  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  const [debouncedName] = useDebouncedValue(ObatKeras, 0);
  const [debouncedPrice] = useDebouncedValue(ObatKeras, 0);

  const [debouncedObatKeras] = useDebouncedValue(ObatKeras, 300);
  const [debouncedObatBebas] = useDebouncedValue(ObatBebas, 300);
  const [debouncedObatBebasTerbatas] = useDebouncedValue(
    ObatBebasTerbatas,
    300,
  );
  const [debouncedNonObat] = useDebouncedValue(NonObat, 300);

  const [debouncedMinPrice] = useDebouncedValue(minPrice, 500);
  const [debouncedMaxPrice] = useDebouncedValue(maxPrice, 500);

  const filter = {
    Filter: {
      name,
      price,
    },
    classification: {
      ObatKeras,
      ObatBebas,
      ObatBebasTerbatas,
      NonObat,
    },
    price: {
      minPrice,
      maxPrice,
    },
  };

  const debouncedFilter = {
    Filter: {
      name: debouncedName,
      price: debouncedPrice,
    },
    classification: {
      ObatKeras: debouncedObatKeras,
      ObatBebas: debouncedObatBebas,
      ObatBebasTerbatas: debouncedObatBebasTerbatas,
      NonObat: debouncedNonObat,
    },
    price: {
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
    },
  };

  const setFilter = {
    setName,
    setPrice,
    setObatKeras,
    setObatBebas,
    setObatBebasTerbatas,
    setNonObat,
    setMinPrice,
    setMaxPrice,
  };

  const resetFilter = () => {
    setName([]),
      setPrice([]),
      setObatKeras([]),
      setObatBebas([]),
      setObatBebasTerbatas([]),
      setNonObat([]),
      setMinPrice('');
    setMaxPrice('');
  };

  return { filter, debouncedFilter, setFilter, resetFilter };
};
