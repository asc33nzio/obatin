'use client';

import { debounce } from '@/utils/debounceThrottle';
import Axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import MagnifyBlueICO from '@/assets/icons/MagnifyBlueICO';
import { SearchInput } from '@/styles/molecules/Search.styles';

export interface CompactProductItf {
  id: number;
  name: string;
  product_slug: string;
  selling_unit: string;
  min_price: number;
  max_price: number;
  image_url: string;
  quantity?: number;
}

const SearchDrugPres = ({
  setSelectedDrugParent,
  setDeleteFunction,
}: {
  setSelectedDrugParent: (newSelectedDrug: CompactProductItf | null) => void;
  setDeleteFunction: (func: () => void) => void;
}) => {
  const [searchResults, setSearchResults] = useState<CompactProductItf[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<CompactProductItf | null>();

  const handleProductClick = (product: CompactProductItf) => {
    setSelectedDrug(product);
    setSelectedDrugParent(product);
  };

  useEffect(() => {
    setDeleteFunction(() => handleDeleteSelectedProduct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDrug]);

  const handleDeleteSelectedProduct = () => {
    setSelectedDrug(null);
    setSelectedDrugParent(null);
    // setQuery('');
    setIsSearchFocused(false);
  };
  const handleSearch = debounce(async (query: string) => {
    try {
      let apiURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/products?search=${query}&limit=25`;
      setIsLoading(true);
      const response = await Axios.get(apiURL);
      setSearchResults(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, 1000);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  return (
    <>
      {!selectedDrug ? (
        <div
          style={{
            position: 'relative',
            display: 'flex',
            gap: '10px',
            padding: '10px',
            boxShadow: '-1px 3px 9px 0px rgba(0, 0, 0, 0.2)',
          }}
        >
          <MagnifyBlueICO />
          <SearchInput
            placeholder='Search Product'
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isSearchFocused && (
            <div
              style={{
                height: '50vh',
                overflowY: 'auto',
                border: '1px solid #ccc',
                padding: '10px',
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: '10',
                backgroundColor: 'white',
                width: '300px',
              }}
            >
              {isLoading && <p>Loading...</p>}
              {!isLoading &&
                searchResults.map((product) => (
                  <div
                    style={{
                      display: 'flex',
                      padding: '10px',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    key={product.id}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ededed';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                    onMouseDown={(e) => {
                      handleProductClick(product);

                      e.preventDefault();
                    }}
                  >
                    <div>{product?.name}</div>
                    <Image
                      src={product.image_url}
                      alt={product.product_slug}
                      width={65}
                      height={65}
                      loading='lazy'
                      objectFit='cover'
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div>{selectedDrug.name}</div>
          <div
            style={{
              height: '25px',
              width: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'white',
              backgroundColor: 'red',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#cd0000';
              e.currentTarget.style.color = 'white';
            }}
            onClick={() => handleDeleteSelectedProduct()}
          >
            x
          </div>
        </div>
      )}
    </>
  );
};

export default SearchDrugPres;
