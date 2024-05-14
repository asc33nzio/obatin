import styled from 'styled-components';

const TableContainer = styled.div`
  width: 80vw;
`;

const Table = styled.table`
  width: 100%;
  height: 100%;
  border: 1px solid #e2e8f0;
  padding: 5.5px 12px;
  border-radius: 12px;
  min-width: 700px;
  border-collapse: collapse;

  td,
  th {
    padding: 12px 24px;
    font-family: 'Inter', sans-serif;
    text-align: center;
  }

  thead {
    background-color: #00b5c0;
    th {
      font-weight: bold;
      font-size: 14px;
      line-height: 18px;
      letter-spacing: 5%;
      color: white;
      border-bottom: 1px solid #e2e8f0;
    }
  }

  tbody {
    tr {
      &.green {
        background-color: #00b6c02c;
      }
    }

    td {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #2d3748;
      border-bottom: 1px solid #e2e8f0;

      &.red {
        color: #f60707;
      }

      &.green {
        color: #33a720;
      }
    }
  }
`;

const FilterStatus = styled.select`
  font-size: 16px;
  padding: 0.3rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
`;

const LimitInput = styled.input`
  font-size: 16px;
  padding: 0.3rem;
`;

const SearchTextInput = styled.input`
  font-size: 16px;
  padding: 0.3rem;
`;

const CustomSection = styled.section`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
`;

const TableFilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailCardContainer = styled.div`
  background-color: white;
  width: 1000px;
  height: 700px;
  padding: 2rem;
  border-radius: 2rem;
`;

const PaginationButtonContainer = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CustomButton = styled.button`
  width: 100%;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: white;

  &.danger {
    background-color: #a00b0b;
  }

  &.green {
    background-color: #00b5c0;

    & :disabled {
      background-color: #ffffff;
      color: white;
    }
  }

  & :disabled {
    background-color: #d8e6f4;
    color: white;
  }
`;
const CustomButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
`;

const TitleText = styled.p`
  font-size: 20px;
  text-align: center;
`;

const CustomInput = styled.input`
  font-size: 16px;
  padding: 0.3rem;
`;

const ModalConfirmationContainer = styled.div`
  width: 400px;
  height: fit-content;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
`;

const PharmacyProductsStyledComponents = {
  TableContainer,
  Table,
  TitleText,
  FilterContainer,
  FilterStatus,
  CustomInput,
  CustomButton,
  CustomButtonsWrapper,
  SearchTextInput,
  LimitInput,
  CustomSection,
  ModalConfirmationContainer,
  TableFilterWrapper,
  DetailCardContainer,
  PaginationButtonContainer,
};

export default PharmacyProductsStyledComponents;
