// import { useModal } from '@/hooks/useModal';
// import {
//   PharmacyCart,
//   updateSelectedPharmacy,
// } from '@/redux/reducers/pharmacySlice';
// import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
// import { SelectPharmacy } from '@/styles/pages/product/ProductDetail.styles';
// import { ProductType } from '@/types/Product';
// import axios from 'axios';
// import { getCookie } from 'cookies-next';
// import React, { useEffect, useState } from 'react';
// import { PacmanLoader } from 'react-spinners';

const SelectNearbyPharmacy = () => {
  //   const dispatch = useObatinDispatch();
  //   const { closeModal } = useModal();
  //   const userInfo = useObatinSelector((state) => state.auth);
  //   const accessToken = getCookie('access_token');
  //   const [isLoading, setIsLoading] = useState<boolean>(true);
  //   // eslint-disable-next-line
  //   const [nearbyPharmacies, setNearbyPharmacies] = useState<PharmacyCart[]>([]);
  // //   const selectedPharmacy = useObatinSelector(
  // //     (state) => state?.pharmacy?.selectedPharmacy,
  // //   );
  //   //eslint-disable-next-line
  //   //   const [product, setProduct] = useObatinSelector(
  //   //     (state) => state.pharmacy.selectedPharmacy,
  //   //   );
  //   const [product, setProduct] = useState<ProductType | undefined>();
  //   useEffect(() => {
  //     const fetchNearbyPharmacies = async () => {
  //       try {
  //         setIsLoading(true);
  //         const userAddress = userInfo?.addresses?.find(
  //           (address) => address.id === userInfo.activeAddressId,
  //         );
  //         if (!userAddress) return;
  //         const { data } = await axios.get(
  //           `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/nearby-pharmacies/products/${product?.id}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${accessToken}`,
  //             },
  //           },
  //         );
  //         setNearbyPharmacies(data.data);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };
  //     if (product && userInfo) {
  //       fetchNearbyPharmacies();
  //     }
  //   }, [product, userInfo]);
  //   const handleSelectPharmacy = (pharmacy: PharmacyCart) => {
  //     dispatch(
  //       updateSelectedPharmacy({
  //         id: pharmacy.id,
  //       }),
  //     );
  //     closeModal();
  //   };
  //   return (
  //     nearbyPharmacies?.length > 0 && (
  //       <SelectPharmacy>
  //         {isLoading ? (
  //           <PacmanLoader size={50} color={'#00B5C0'} />
  //         ) : (
  //           <>
  //             <h2>Apotek terdekat:</h2>
  //             <div>
  //               {nearbyPharmacies?.map((pharmacy) => (
  //                 <ul
  //                   key={pharmacy.id}
  //                   onClick={() => handleSelectPharmacy(pharmacy)}
  //                 >
  //                   <li>{pharmacy.name}</li>
  //                 </ul>
  //               ))}
  //             </div>
  //           </>
  //         )}
  //       </SelectPharmacy>
  //     )
  //   );
};

export default SelectNearbyPharmacy;
