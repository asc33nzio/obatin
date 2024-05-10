import { useModal } from '@/hooks/useModal';
import { updateSelectedPharmacy } from '@/redux/reducers/pharmacySlice';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { ShippingMethodsType } from '@/types/shippingType';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import styled from 'styled-components';

const ContainerShip = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;
const ShippingOption = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 12px;
  cursor: pointer;
  width: 300px;

  &:hover {
    background-color: #00b5c0;
    color: white;
  }
`;

const AddShippingModalContent = () => {
  const dispatch = useObatinDispatch();
  const selectedPharmacy = useObatinSelector(
    (state) => state?.pharmacy?.selectedPharmacy,
  );
  const accessToken = getCookie('access_token');
  const [shippingMethods, setShippingMethods] = useState<ShippingMethodsType[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { closeModal } = useModal();

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/pharmacy/shippings`,
          {
            pharmacy_id: selectedPharmacy?.id,
            destination_city_id: selectedPharmacy?.city_id,
            distance: selectedPharmacy?.distance,
            weight: selectedPharmacy?.total_weight,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = response.data.data;
        setShippingMethods(data.shipping_methods);
        // dispatch(setSelectedPharmacy({ data: data }));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShippingMethods();
  }, [accessToken, selectedPharmacy]);

  const handleSelectShippingMethod = (method: ShippingMethodsType) => {
    dispatch(
      updateSelectedPharmacy({
        shipping_id: method.shipping_id,
        shipping_cost: method.price,
        shipping_name: method.name,
      }),
    );
    setIsLoading(true);
    closeModal();
  };

  return (
    <ContainerShip>
      {isLoading ? (
        <PacmanLoader size={50} color={'#00B5C0'} />
      ) : (
        shippingMethods.map((method: ShippingMethodsType) => (
          <ShippingOption
            key={method.shipping_id}
            onClick={() => handleSelectShippingMethod(method)}
          >
            <h4>{method.name}</h4>
            <p>Ongkos kirim: Rp{method.price.toLocaleString()}</p>
            <p>Metode Pengiriman: {method.type}</p>
            <p>Pelayanan: {method.service}</p>
            <p>Deskripsi: {method.description}</p>
            <p>Perkiraan Pengiriman: {method.estimated}</p>
          </ShippingOption>
        ))
      )}
    </ContainerShip>
  );
};
export default AddShippingModalContent;
