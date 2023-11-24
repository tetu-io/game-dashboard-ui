import { UserEntity } from '../../../generated/gql';

export interface UserItemInterface extends UserEntity {
  itemsSize: number;
  earn: number;
  tokenList: string[];
  earnedList: number[];
  tokenSums: { [key: string]: number };
}