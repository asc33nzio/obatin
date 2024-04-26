'use client';
import {
  ExploreMore,
  SearchContainer,
  SearchInput,
  SearchResult,
  SearchResultStack,
} from '@/styles/molecules/Search.styles';
import { PropagateLoader } from 'react-spinners';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { debounce } from '@/utils/debounce';
import Axios from 'axios';
import Image from 'next/image';

interface CompactProductItf {
  id: number;
  name: string;
  product_slug: string;
  selling_unit: string;
  min_price: number;
  max_price: number;
  image_url: string;
}

const Search = (): React.ReactElement => {
  const searchParams = useSearchParams();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [products, setProducts] = useState<CompactProductItf[]>([]);
  const [search, setSearch] = useState<string>('');
  const [totalHit, setTotalHit] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const handleSearch = debounce(
    async (query: string) => {
      try {
        let apiURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/products?search=${query}&limit=5`;
        const response = await Axios.get(apiURL);

        setSearch(query);
        setProducts(response.data.data);
        setTotalHit(response.data.pagination.total_records);
      } catch (error) {
        console.error(error);
        setToast({
          showToast: true,
          toastMessage: 'Maaf, mohon coba kembali',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
      }
    },
    2000,
    setIsLoading,
  );

  // const handleNavigation = (term: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   if (term) {
  //     params.set(`/shop/${search}`, term);
  //   } else {
  //     params.delete('query');
  //   }
  // };

  return (
    <SearchContainer>
      <SearchInput
        placeholder='Search Product'
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />

      {isSearchFocused && isLoading && (
        <SearchResultStack>
          <SearchResult $isLoader={true}>
            <PropagateLoader
              loading={isLoading}
              color='#dd1b50'
              speedMultiplier={0.8}
              size={'15px'}
              cssOverride={{ width: '100%' }}
            />
          </SearchResult>
        </SearchResultStack>
      )}

      {isSearchFocused && products.length > 0 && !isLoading && (
        <SearchResultStack>
          {products.map((product) => (
            <SearchResult
              key={product.id}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              <Image
                src={product.image_url}
                alt={product.product_slug}
                width={65}
                height={65}
                loading='lazy'
                objectFit='cover'
              />
              <h1>{product.name}</h1>
              <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                Tersedia dari <br />
                Rp.{' '}
                {Math.floor(product.min_price / 1000).toLocaleString('id-ID')}K
              </span>
            </SearchResult>
          ))}

          {products.length >= 3 && !isLoading && (
            <ExploreMore
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              <span style={{ textAlign: 'center' }}>
                Lihat {totalHit} produk terkait &quot;
                {search.charAt(0).toUpperCase() + search.slice(1)}&quot;
              </span>
            </ExploreMore>
          )}
        </SearchResultStack>
      )}

      {isSearchFocused &&
        products.length === 0 &&
        search !== '' &&
        !isLoading && (
          <SearchResultStack>
            <SearchResult $is404={true}>
              <h2>Maaf, produk yang anda cari tidak dapat ditemukan</h2>
            </SearchResult>
          </SearchResultStack>
        )}
    </SearchContainer>
  );
};

export default Search;
