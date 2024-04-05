import { TokenTransactionEntity } from '../../../generated/gql';

export interface TransactionItemInterface extends TokenTransactionEntity {
  amountFormatted: string;
  repeat: number;
}