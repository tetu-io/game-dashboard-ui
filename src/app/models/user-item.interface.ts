import { UserEntity } from '../../../generated/gql';

export interface UserItemInterface extends UserEntity {
  itemsSize: number;
}