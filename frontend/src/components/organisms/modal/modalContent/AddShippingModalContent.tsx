import {
  updateCheckoutInfo,
  updateShippingInfo,
} from '@/redux/reducers/pharmacySlice';
import { useModal } from '@/hooks/useModal';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { ShippingMethodsType } from '@/types/shippingType';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import Axios from 'axios';
import styled from 'styled-components';

const ContainerShip = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 5px;

  @media (max-width: 768px) {
    padding-top: 2rem;
    overflow-y: auto;
  }
`;

const ShippingOption = styled.div`
  cursor: pointer;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 12px;
  width: 300px;

  &:hover {
    background-color: #00b5c0;
    color: white;
  }
`;

const AddShippingModalContent = () => {
  const dispatch = useObatinDispatch();
  const accessToken = getCookie('access_token');
  const { closeModal } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const selectedPharmacy = useObatinSelector(
    (state) => state?.pharmacy?.selectedPharmacy,
  );
  const [shippingMethods, setShippingMethods] = useState<ShippingMethodsType[]>(
    [],
  );

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        setIsLoading(true);
        const totalWeight = selectedPharmacy?.cart_items?.reduce(
          (total, cartItem) => {
            return total + cartItem.weight * cartItem.quantity;
          },
          0,
        );
        if (totalWeight >= 29998) return;
        const response = await Axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/pharmacy/shippings`,
          {
            pharmacy_id: selectedPharmacy?.id,
            destination_city_id: selectedPharmacy?.city_id,
            distance: selectedPharmacy?.distance,
            weight: totalWeight,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = response.data.data;
        setShippingMethods(data.shipping_methods);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShippingMethods();
  }, [accessToken, selectedPharmacy]);

  const handleSelectShippingMethod = (method: ShippingMethodsType) => {
    const shipping_service = `${method.service.toUpperCase()} - ${method.description}`;
    dispatch(
      updateCheckoutInfo({
        checkoutShipmentSubtotal: method.price,
      }),
    );
    dispatch(
      updateShippingInfo({
        shipping_id: method.shipping_id,
        shipping_cost: method.price,
        shipping_name: method.name,
        shipping_estimation: method.estimated,
        shipping_service,
      }),
    );
    closeModal();
  };

  return (
    <ContainerShip>
      {isLoading ? (
        <PacmanLoader size={50} color={'#00B5C0'} />
      ) : (
        shippingMethods.map((method: ShippingMethodsType, index) => (
          <ShippingOption
            key={`shippingMethodCard${method.shipping_id}_${method.code}_${index}`}
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
