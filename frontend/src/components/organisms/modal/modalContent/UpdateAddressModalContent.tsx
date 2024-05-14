'use client';
import {
  AddAddressModalButtonsContainer,
  AddAddressModalContentContainer,
  LoaderDiv,
  MapLoaderDiv,
  ProvinceCityDiv,
} from '@/styles/organisms/modal/modalContent/AddAddressModalContent.styles';
import { useEffect, useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useObatinDispatch, useObatinSelector } from '@/redux/store/store';
import { setAuthState } from '@/redux/reducers/authSlice';
import { ObatinProvinceItf, RajaOngkirProvinceItf } from '@/types/reduxTypes';
import { setProvincesState } from '@/redux/reducers/provincesSlice';
import { HashLoader, PropagateLoader } from 'react-spinners';
import { getCookie } from 'cookies-next';
import { debounce } from '@/utils/debounceThrottle';
import CustomButton from '@/components/atoms/button/CustomButton';
import Axios from 'axios';
import CustomSelect from '@/components/atoms/select/CustomSelect';
import RegularInput from '@/components/atoms/input/RegularInput';
import L from 'leaflet';

interface CityItf {
  city_id: string;
  city_name: string;
  postal_code: string;
}

const UpdateAddressModalContent = (): React.ReactElement => {
  const { setToast } = useToast();
  const { closeModal } = useModal();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const provinces = useObatinSelector((state) => state?.provinces?.provinces);
  const userInfo = useObatinSelector((state) => state?.auth);
  const proposedUpdateAddressId = sessionStorage.getItem('puID');
  const defaultAddress = userInfo?.addresses?.find((address) => {
    if (proposedUpdateAddressId !== null) {
      return address.id === parseInt(proposedUpdateAddressId, 10);
    }
  });
  const defaultAddressId = defaultAddress?.id;
  const defaultProvinceId = defaultAddress?.city?.province?.id;
  const defaultCityId = defaultAddress?.city?.id;
  const defaultLatitude = defaultAddress?.latitude;
  const defaultLongitude = defaultAddress?.longitude;
  const dispatch = useObatinDispatch();
  const [alias, setAlias] = useState<string>(defaultAddress?.alias!);
  const [aliasValidationError, setAliasValidationError] = useState<string>('');
  const [lng, setLng] = useState<number>(
    parseInt(defaultAddress?.longitude!, 10),
  );
  const [lat, setLat] = useState<number>(
    parseInt(defaultAddress?.latitude!, 10),
  );
  const [provinceNames, setProvinceNames] = useState<Array<string>>([]);
  const [chosenProvinceId, setChosenProvinceId] = useState<string>('');
  const [chosenProvinceName, setChosenProvinceName] = useState<string>('');
  const [cities, setCities] = useState<Array<CityItf>>([]);
  const [cityNames, setCityNames] = useState<Array<string>>([]);
  const [chosenCityId, setChosenCityId] = useState<string>(
    defaultAddress?.city?.id!?.toString(),
  );
  const [chosenCityName, setChosenCityName] = useState<string>('');
  const [address, setAddress] = useState<string>(defaultAddress?.detail!);
  const [addressValidationError, setAddressValidationError] =
    useState<string>('');
  const [isProvinceLoading, setIsProvinceLoading] = useState<boolean>(false);
  const [isCityLoading, setIsCityLoading] = useState<boolean>(false);
  const [isCoordinatesLoading, setIsCoordinatesLoading] =
    useState<boolean>(false);
  const accessToken = getCookie('access_token');
  const aid = useObatinSelector((state) => state?.auth?.aid);
  const openCageApiUrl = process.env.NEXT_PUBLIC_OPENCAGE_API_URL;
  const rajaOngkirBaseUrl = process.env.NEXT_PUBLIC_RAJAONGKIR_API_URL;
  const [hasUserChangedProvince, setHasUserChangedProvince] =
    useState<boolean>(false);
  const [hasUserChangedCity, setHasUserChangedCity] = useState<boolean>(false);

  const fetchProvinces = async () => {
    try {
      setIsProvinceLoading(true);
      setHasUserChangedProvince(true);
      const response = await Axios.get(`${rajaOngkirBaseUrl}/province`);

      const provinces: ObatinProvinceItf[] = response?.data?.map(
        (entry: RajaOngkirProvinceItf) => ({
          province_id: entry.province_id,
          province_name: entry.province,
        }),
      );

      dispatch(setProvincesState({ provinces }));
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Rajaongkir key expired',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } finally {
      setIsProvinceLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      setIsCityLoading(true);
      const response = await Axios.get(
        `${rajaOngkirBaseUrl}/city?province=${chosenProvinceId !== '' ? parseInt(chosenProvinceId, 10) : null}`,
      );

      const cities: CityItf[] = response?.data?.map((entry: CityItf) => ({
        city_id: entry.city_id,
        city_name: entry.city_name,
        postal_code: entry.postal_code,
      }));

      setCities(cities);
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Rajaongkir key expired',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } finally {
      setIsCityLoading(false);
    }
  };

  const fetchCoordinates = async () => {
    try {
      setIsCoordinatesLoading(true);

      let query: string = '';
      if (chosenProvinceName) query += chosenProvinceName;
      if (chosenCityName) query += `,${chosenCityName}`;
      if (address) query += `,${address}`;

      const response = await Axios.get(`${openCageApiUrl}?q=${query}`);

      setLng(response?.data?.results?.[0]?.geometry?.lng);
      setLat(response?.data?.results?.[0]?.geometry?.lat);
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'OpenCage key expired',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } finally {
      setIsCoordinatesLoading(false);
    }
  };

  const handleProvinceChange = (selectedProvinceName: string) => {
    const selectedProvince = provinces.find(
      (province) => province.province_name === selectedProvinceName,
    );
    if (selectedProvinceName === '__RESET__') {
      setHasUserChangedProvince(true);
      setChosenProvinceId('');
    }
    if (selectedProvince) {
      setHasUserChangedProvince(true);
      setChosenProvinceId(selectedProvince.province_id);
      setChosenProvinceName(selectedProvince.province_name);
    }
  };

  const handleCityChange = (selectedCityName: string) => {
    const selectedCity = cities.find(
      (city) => city.city_name === selectedCityName,
    );
    if (selectedCityName === '__RESET__') {
      setHasUserChangedCity(true);
      setChosenCityId('');
    }
    if (selectedCity) {
      setHasUserChangedCity(true);
      setChosenCityId(selectedCity.city_id);
      setChosenCityName(selectedCity.city_name);
    }
  };

  const validateAlias = (input: string) => {
    const sanitizedInput = input.trim();
    if (sanitizedInput.length === 0) {
      setAliasValidationError('Alias tidak boleh kosong');
      return false;
    }

    setAliasValidationError('');
    return true;
  };

  const handleAliasChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (validateAlias(event.target.value)) {
        setAlias(event.target.value);
      }
    },
    1000,
  );

  const validateAddress = (input: string) => {
    const sanitizedInput = input.trim();
    if (sanitizedInput.length === 0) {
      setAddressValidationError('Alamat tidak boleh kosong');
      return false;
    }

    setAddressValidationError('');
    return true;
  };

  const handleAddressChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (validateAddress(event.target.value)) {
        setHasUserChangedProvince(true);
        setHasUserChangedCity(true);
        setAddress(event.target.value);
      }
    },
    1000,
  );

  const handleUpdateAddress = async () => {
    let isValidPayload = true;
    if (!validateAlias(alias)) isValidPayload = false;
    if (!validateAddress(address)) isValidPayload = false;
    if (!chosenCityId || !address || !lat || !lng) isValidPayload = false;

    if (!isValidPayload) {
      setToast({
        showToast: true,
        toastMessage: 'Alamat anda belum sesuai, mohon cek kembali',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    if (
      alias === defaultAddress?.alias &&
      parseInt(chosenCityId, 10) === defaultAddress?.city?.id &&
      address === defaultAddress?.detail &&
      lng.toString() === defaultAddress?.longitude &&
      lat.toString() === defaultAddress?.latitude
    ) {
      setToast({
        showToast: true,
        toastMessage: 'Tidak ada perubahan',
        toastType: 'warning',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      sessionStorage.removeItem('puID');
      closeModal();
      return;
    }

    const payload = {
      alias,
      city_id: parseInt(chosenCityId, 10),
      detail: address,
      lng,
      lat,
    };

    try {
      await Axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${aid}/addresses/${defaultAddressId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const userDetailUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userInfo?.aid}`;
      const getNewUserDetailReq = await Axios.get(userDetailUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const newUserData = getNewUserDetailReq.data.data;

      dispatch(
        setAuthState({
          aid: userInfo.aid,
          email: userInfo.email,
          name: userInfo.name,
          gender: userInfo.gender,
          birthDate: userInfo.birthDate,
          role: userInfo.role,
          avatarUrl: userInfo.avatarUrl,
          isVerified: userInfo.isVerified,
          isApproved: userInfo.isApproved,
          activeAddressId: userInfo.activeAddressId,
          addresses: newUserData.addresses,
        }),
      );

      setToast({
        showToast: true,
        toastMessage: 'Alamat anda berhasil diperbaharui',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });

      sessionStorage.removeItem('puID');
      closeModal();
    } catch (error) {
      console.log(error);

      setToast({
        showToast: true,
        toastMessage: 'Alamat anda belum sesuai, mohon cek kembali',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  useEffect(() => {
    if (provinces.length === 0) {
      fetchProvinces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProvinceNames(provinces.map((province) => province.province_name));
  }, [provinces]);

  useEffect(() => {
    if (chosenProvinceId !== '') {
      fetchCities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenProvinceId]);

  useEffect(() => {
    setCityNames(cities.map((city) => city.city_name));
  }, [cities]);

  useEffect(() => {
    if (chosenProvinceName) {
      fetchCoordinates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenProvinceName, chosenCityName, address]);

  useEffect(() => {
    if (defaultProvinceId && !hasUserChangedProvince) {
      const defaultProvince = provinces.find(
        (province) => parseInt(province.province_id, 10) === defaultProvinceId,
      );
      if (defaultProvince) {
        setChosenProvinceId(defaultProvince.province_id);
        setChosenProvinceName(defaultProvince.province_name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultProvinceId, provinces]);

  useEffect(() => {
    if (defaultCityId && !hasUserChangedCity) {
      const defaultCity = cities.find(
        (city) => parseInt(city.city_id, 10) === defaultCityId,
      );
      if (defaultCity) {
        setChosenCityId(defaultCity.city_id);
        setChosenCityName(defaultCity.city_name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCityId, cities]);

  useEffect(() => {
    if (chosenProvinceName && !isNaN(lng)) {
      let latitude =
        defaultLatitude !== undefined &&
        defaultLatitude !== null &&
        !hasUserChangedProvince &&
        !hasUserChangedCity
          ? parseFloat(defaultLatitude)
          : lat || -6.175372;
      let longitude =
        defaultLongitude !== undefined &&
        defaultLongitude !== null &&
        !hasUserChangedProvince &&
        !hasUserChangedCity
          ? parseFloat(defaultLongitude)
          : lng || 106.827194;

      const map = L.map('map').setView([latitude, longitude], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap &copy; ObatIn 2024',
      }).addTo(map);

      const marker = L.marker([latitude, longitude], { draggable: true })
        .addTo(map)
        .bindPopup(
          'Pastikan alamat anda sudah sesuai, bila tidak, mohon geser penanda',
        )
        .openPopup();

      marker.on('dragend', (event) => {
        const { lat, lng } = event.target.getLatLng();
        setLat(lat);
        setLng(lng);
      });

      return () => {
        map.remove();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return (
    <AddAddressModalContentContainer>
      <link
        rel='stylesheet'
        href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        integrity='sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
        crossOrigin=''
      />
      <RegularInput
        title='Nama tempat'
        placeholder='Masukkan nama tempat'
        defaultValue={
          defaultAddress?.alias !== null ? defaultAddress?.alias : ''
        }
        $height={75}
        $marBot={0}
        validationMessage={aliasValidationError}
        onChange={handleAliasChange}
      />

      <ProvinceCityDiv>
        {isProvinceLoading ? (
          <LoaderDiv>
            <PropagateLoader
              color='#dd1b50'
              speedMultiplier={0.8}
              size={'10px'}
            />
          </LoaderDiv>
        ) : (
          <CustomSelect
            $options={provinceNames}
            $title='Provinsi'
            $onOptionChange={handleProvinceChange}
            $disabled={chosenCityId !== ''}
            $defaultSelected={
              !hasUserChangedProvince ? chosenProvinceName : null
            }
          />
        )}

        {isCityLoading ? (
          <LoaderDiv>
            <PropagateLoader
              color='#dd1b50'
              speedMultiplier={0.8}
              size={'10px'}
            />
          </LoaderDiv>
        ) : (
          <CustomSelect
            $options={cityNames}
            $title={
              !chosenProvinceName ? 'Pilih provinsi terlebih dahulu' : 'Kota'
            }
            $onOptionChange={handleCityChange}
            $disabled={chosenProvinceId === ''}
            $defaultSelected={!hasUserChangedCity ? chosenCityName : null}
          />
        )}
      </ProvinceCityDiv>

      <RegularInput
        title='Alamat'
        placeholder={
          !chosenProvinceName
            ? 'Pilih provinsi terlebih dahulu'
            : !chosenCityName
              ? 'Pilih kota terlebih dahulu'
              : 'Masukkan alamat'
        }
        $height={75}
        $marBot={0}
        defaultValue={
          defaultAddress?.detail !== null ? defaultAddress?.detail : ''
        }
        validationMessage={addressValidationError}
        onChange={handleAddressChange}
        $disabled={!chosenCityName}
      />

      {isNaN(lng) ? (
        <MapLoaderDiv>
          <span style={{ fontSize: '18px', color: '#de161c' }}>
            Maaf, mohon cek kembali alamat anda
          </span>
          <HashLoader size={100} color='#dd1b50' speedMultiplier={0.8} />
        </MapLoaderDiv>
      ) : isCoordinatesLoading || !chosenProvinceName ? (
        <MapLoaderDiv>
          <HashLoader size={100} color='#dd1b50' speedMultiplier={0.8} />
        </MapLoaderDiv>
      ) : (
        <div id='map' style={{ height: '400px' }}></div>
      )}

      <AddAddressModalButtonsContainer>
        <CustomButton
          content='Batal'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          $bgColor='#de161c'
          onClick={() => {
            closeModal();
            setToast({
              showToast: true,
              toastMessage: 'Alamat anda tidak tersimpan',
              toastType: 'warning',
              resolution: isDesktopDisplay ? 'desktop' : 'mobile',
              orientation: 'center',
            });
          }}
        />
        <CustomButton
          content='Konfirmasi'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          onClick={handleUpdateAddress}
        />
      </AddAddressModalButtonsContainer>
    </AddAddressModalContentContainer>
  );
};

export default UpdateAddressModalContent;
