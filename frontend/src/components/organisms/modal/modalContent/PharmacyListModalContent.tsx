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
import { GetPharmaciesParams, PharmacyType } from '@/types/pharmacyType';
import { PartnerType } from '@/types/partnerTypes';

const ContentContainer = styled.div`
  width: 800px;
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

const PharmacyListModalContent = ({
  handleChangePharmacy = () => {},
  selectedPartner,
}: {
  handleChangePharmacy?: (id?: number, name?: string) => void;
  selectedPartner?: PartnerType;
}) => {
  const { setToast } = useToast();
  const accessToken = getCookie('access_token');
  const [getPharmaciesParams, setGetPharmaciesParams] =
    useState<GetPharmaciesParams>({
      search: null,
      limit: '12',
      page: null,
      partner_id: selectedPartner?.id?.toString() || null,
      city: null,
    });

  const fetcherGet = (url: string) =>
    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + url, {
        params: { ...getPharmaciesParams },
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

  const { data: res, isLoading } = useSWR<APIResponseItf<Array<PharmacyType>>>(
    `/pharmacies`,
    fetcherGet,
  );

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGetPharmaciesParams({
        ...getPharmaciesParams,
        search: event.target.value === '' ? null : event.target.value,
        page: '1',
      });
    },
    750,
  );

  useEffect(() => {
    setGetPharmaciesParams({
      ...getPharmaciesParams,
      partner_id: selectedPartner?.id?.toString() || null,
    });
  }, [selectedPartner]);

  useEffect(() => {
    mutate('/pharmacies');
  }, [getPharmaciesParams]);

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
        onChange={handleSearch}
        type='text'
        placeholder='Cari Apotek'
      />
      {isLoading ? (
        <PropagateLoader />
      ) : (
        <>
          <Grid>
            {res?.data?.map((item, index) => (
              <Card
                key={index}
                onClick={() => handleChangePharmacy(item?.id, item?.name)}
              >
                <Title>{item.name}</Title>
              </Card>
            ))}
          </Grid>
          <PaginationComponent
            page={res?.pagination?.page || 1}
            totalPages={res?.pagination?.page_count || 1}
            handleNextPage={() => {
              setGetPharmaciesParams({
                ...getPharmaciesParams,
                page: (
                  parseInt(getPharmaciesParams?.page || '1') + 1
                ).toString(),
              });
            }}
            handlePrevPage={() => {
              setGetPharmaciesParams({
                ...getPharmaciesParams,
                page: (
                  parseInt(getPharmaciesParams?.page || '1') - 1
                ).toString(),
              });
            }}
            goToPage={(i) => {
              setGetPharmaciesParams({
                ...getPharmaciesParams,
                page: i.toString(),
              });
            }}
          />
        </>
      )}
    </ContentContainer>
  );
};

export default PharmacyListModalContent;
