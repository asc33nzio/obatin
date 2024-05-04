import styled from 'styled-components';

export const AddAddressModalContentContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  row-gap: 25px;
`;

export const AddAddressModalButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  align-items: center;
  justify-content: space-between;

  width: 55%;
  height: 50px;
`;

export const ProvinceCityDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 40px;
  gap: 10px;
`;

export const LoaderDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 35px;
`;

export const MapLoaderDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 400px;

  gap: 50px;
`;
