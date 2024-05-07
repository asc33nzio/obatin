import {
  TransactionCardContainer,
  TxHeaders,
  TxProductBreakdown,
} from '@/styles/molecules/cards/TransactionCard.styles';
import { TxStatusTypes } from '@/types/transactionTypes';
import Image from 'next/image';

export interface CompactProductInfoItf {
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface TransactionCardPropsItf {
  pharmacy: string;
  date: string;
  invoiceNumber: string;
  status: TxStatusTypes;
  products: Array<CompactProductInfoItf>;
}

const TransactionCard = (
  props: TransactionCardPropsItf,
): React.ReactElement => {
  return (
    <TransactionCardContainer>
      <TxHeaders>
        <h1>{props.pharmacy}</h1>
        <h2>{props.date}</h2>
        <h3>{props.invoiceNumber}</h3>
      </TxHeaders>

      <TxProductBreakdown>
        <Image
          src={props?.products?.[0]?.imageUrl}
          alt='txCardProductImage${index}'
          width={75}
          height={75}
        />
      </TxProductBreakdown>
    </TransactionCardContainer>
  );
};

export default TransactionCard;
