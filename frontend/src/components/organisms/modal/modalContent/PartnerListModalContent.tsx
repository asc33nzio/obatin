import { useToast } from '@/hooks/useToast';
import { APIResponseItf } from '@/types/response';
import { debounce } from '@/utils/debounce';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import styled from 'styled-components';
import useSWR, { mutate } from 'swr';
import DefaultPartnerLogo from '@/assets/DefaultPartnerLogo.jpeg';
import PaginationComponent from '../../pagination/PaginationComponent';
import { GetPartnersParams, PartnerType } from '@/types/partnerTypes';

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

const PartnerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  min-height: 410px;
`;

const PartnerCard = styled.div`
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

const PartnerName = styled.p`
  font-size: 18px;
  font-weight: 600;
`;

const PartnerLogo = styled(Image)``;

const CutomSearch = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  align-self: flex-start;
`;

const PartnerListModalContent = ({
  handleChangePartner = () => {},
}: {
  handleChangePartner?: (id?: number, name?: string) => void;
}) => {
  const { setToast } = useToast();
  const accessToken = getCookie('access_token');
  const [getPartnersParams, setGetPartnersParams] = useState<GetPartnersParams>(
    {
      search: null,
      limit: null,
      page: null,
    },
  );

  const fetcherGet = (url: string) =>
    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + url, {
        params: { ...getPartnersParams },
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

  const { data: res, isLoading } = useSWR<APIResponseItf<Array<PartnerType>>>(
    `/partners`,
    fetcherGet,
  );

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGetPartnersParams({
        ...getPartnersParams,
        search: event.target.value === '' ? null : event.target.value,
        page: '1',
      });
    },
    750,
  );

  useEffect(() => {
    mutate('/partners');
  }, [getPartnersParams]);

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
        placeholder='Cari Partner'
      />
      {isLoading ? (
        <PropagateLoader />
      ) : (
        <>
          <PartnerGrid>
            {res?.data?.map((item, index) => (
              <PartnerCard
                key={index}
                onClick={() => handleChangePartner(item?.id, item?.name)}
              >
                <PartnerLogo
                  width={50}
                  height={50}
                  src={item.logo_url || DefaultPartnerLogo}
                  alt={`logo ${item.name}`}
                />
                <PartnerName>{item.name}</PartnerName>
              </PartnerCard>
            ))}
          </PartnerGrid>
          <PaginationComponent
            page={res?.pagination?.page || 1}
            totalPages={res?.pagination?.page_count || 1}
            handleNextPage={() => {
              setGetPartnersParams({
                ...getPartnersParams,
                page: (parseInt(getPartnersParams?.page || '1') + 1).toString(),
              });
            }}
            handlePrevPage={() => {
              setGetPartnersParams({
                ...getPartnersParams,
                page: (parseInt(getPartnersParams?.page || '1') - 1).toString(),
              });
            }}
            goToPage={(i) => {
              setGetPartnersParams({
                ...getPartnersParams,
                page: i.toString(),
              });
            }}
          />
        </>
      )}
    </ContentContainer>
  );
};

export default PartnerListModalContent;
