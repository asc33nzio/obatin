import { useObatinSelector } from '@/redux/store/store';
import {
  ViewMoreHeaders,
  ViewMoreModalContainer,
} from '@/styles/organisms/modal/modalContent/ViewMoreModalContent.styles';

const ViewMoreTxModalContent = (): React.ReactElement => {
  const txData: any = useObatinSelector((state) => state?.tx?.orders);
  console.log(txData);
  // eslint-disable-next-line
  const pharmacyInfo = txData.pharmacyInfo;
  // eslint-disable-next-line
  const shippingInfo = txData.shippingInfo;
  // eslint-disable-next-line
  const products = txData.products;
  // eslint-disable-next-line
  const createdAt = txData.createdAt;
  // eslint-disable-next-line
  const invoiceNumber = txData.invoiceNumber;

  return (
    <ViewMoreModalContainer>
      <ViewMoreHeaders></ViewMoreHeaders>
    </ViewMoreModalContainer>
  );
};

export default ViewMoreTxModalContent;
