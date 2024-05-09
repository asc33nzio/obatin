import {
  BreakdownCenterDiv,
  BreakdownRightDiv,
  SeparatorDiv,
} from '@/styles/molecules/cards/TransactionCard.styles';
import {
  ProductBreakdownContainer,
  TxProductBreakdownModal,
  ViewMoreHeaders,
  ViewMoreModalContainer,
} from '@/styles/organisms/modal/modalContent/ViewMoreModalContent.styles';
import { useObatinSelector } from '@/redux/store/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ViewMoreTxModalContent = (): React.ReactElement => {
  const router = useRouter();
  const products = useObatinSelector((state) => state?.tx?.products);
  const info = useObatinSelector((state) => state?.tx?.info);
  console.log(info);
  // const pharmacyInfo = products.pharmacyInfo;
  // const shippingInfo = products.shippingInfo;
  // const createdAt = products.createdAt;
  // const invoiceNumber = products.invoiceNumber;

  return (
    <ViewMoreModalContainer>
      <ViewMoreHeaders>asd</ViewMoreHeaders>

      <ProductBreakdownContainer>
        {products?.map((product, index) => {
          return (
            <TxProductBreakdownModal key={`txProductCardDetailed${index}`}>
              <Image
                src={product.thumbnail_url}
                alt={`txProductIMG${index}`}
                width={75}
                height={75}
                onClick={() => router.replace(`/products/${product.slug}`)}
              />

              <BreakdownCenterDiv $isModal={true}>
                <h1>
                  {product.name.charAt(0).toUpperCase()}
                  {product.name.slice(1, product.name.length - 1)}
                </h1>
                <span>
                  {product.quantity} unit x Rp.&nbsp;
                  {product.price.toLocaleString('id-ID')} {product.selling_unit}
                </span>
                <span>
                  {product.weight > 1000
                    ? `${product.weight / 1000} kg`
                    : `${product.weight} g`}
                  &nbsp;
                  {product.selling_unit}
                </span>
              </BreakdownCenterDiv>

              <SeparatorDiv />

              <BreakdownRightDiv $isModal={true}>
                Total untuk produk ini:
                <span>
                  Rp.{' '}
                  {(product.price * product.quantity).toLocaleString('id-ID')}
                </span>
              </BreakdownRightDiv>
            </TxProductBreakdownModal>
          );
        })}
      </ProductBreakdownContainer>
    </ViewMoreModalContainer>
  );
};

export default ViewMoreTxModalContent;
