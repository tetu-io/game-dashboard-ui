import { ItemEntity } from '../../../generated/gql';

export interface ItemInterface extends ItemEntity {
  augmentedCount: number;
  repairedCount: number;
  destroyedCount: number;
}