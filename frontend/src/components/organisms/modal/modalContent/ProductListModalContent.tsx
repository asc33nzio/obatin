/* eslint-disable react-hooks/exhaustive-deps */
import { useToast } from '@/hooks/useToast';
import { APIResponseItf } from '@/types/response';
import { debounce } from '@/utils/debounceThrottle';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import styled from 'styled-components';
import useSWR, { mutate } from 'swr';
import PaginationComponent from '../../pagination/PaginationComponent';
import { IGetProductsParam, INullableProduct } from '@/types/Product';
import Image from 'next/image';

const ContentContainer = styled.div`
  width: 1080px;
  height: 700px;
  padding: 3rem;
  background-color: white;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  min-height: 410px;
`;

const Card = styled.div`
  width: 100%;
  height: fit-content;
  border: 1px solid grey;
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #dfdfdf;
  }
`;

const Title = styled.p`
  font-size: 18px;
  font-weight: 600;
`;

const CutomSearch = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  align-self: flex-start;
`;

const ProductListModalContent = ({
  handleChangeProduct = () => {},
}: {
  handleChangeProduct?: (id?: number, name?: string) => void;
}) => {
  const { setToast } = useToast();
  const accessToken = getCookie('access_token');
  const [getProductsParams, setGetProductsParams] = useState<IGetProductsParam>(
    {
      search: null,
      limit: '12',
      page: null,
    },
  );

  const fetcherGet = (url: string) =>
    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + url, {
        params: { ...getProductsParams },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data)
      .catch((error) =>
        setToast({
          showToast: true,
          toastMessage: error.response.data.message,
          toastType: 'error',
          resolution: 'desktop',
          orientation: 'center',
        }),
      );

  const { data: res, isLoading } = useSWR<
    APIResponseItf<Array<INullableProduct>>
  >(`/shop/products`, fetcherGet);

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGetProductsParams({
        ...getProductsParams,
        search: event.target.value === '' ? null : event.target.value,
        page: '1',
      });
    },
    750,
  );

  useEffect(() => {
    setGetProductsParams({
      ...getProductsParams,
    });
  }, []);

  useEffect(() => {
    mutate('/shop/products');
  }, [getProductsParams]);

  if (isLoading) {
    return (
      <>
        <PropagateLoader />
      </>
    );
  }

  return (
    <ContentContainer>
      <CutomSearch
        type='text'
        placeholder='Cari Produk '
        onChange={handleSearch}
      />
      {isLoading ? (
        <PropagateLoader />
      ) : (
        <>
          <Grid>
            {res?.data?.map((item, index) => (
              <Card
                key={index}
                onClick={() => handleChangeProduct(item?.id, item?.name)}
              >
                <Title>{item.name}</Title>
                {item.image_url != null && (
                  <Image
                    height={40}
                    width={40}
                    alt='product image'
                    src={item.image_url}
                  ></Image>
                )}
              </Card>
            ))}
          </Grid>
          <PaginationComponent
            page={res?.pagination?.page || 1}
            totalPages={res?.pagination?.page_count || 1}
            handleNextPage={() => {
              setGetProductsParams({
                ...getProductsParams,
                page: (parseInt(getProductsParams?.page || '1') + 1).toString(),
              });
            }}
            handlePrevPage={() => {
              setGetProductsParams({
                ...getProductsParams,
                page: (parseInt(getProductsParams?.page || '1') - 1).toString(),
              });
            }}
            goToPage={(i) => {
              setGetProductsParams({
                ...getProductsParams,
                page: i.toString(),
              });
            }}
          />
        </>
      )}
    </ContentContainer>
  );
};

export default ProductListModalContent;
