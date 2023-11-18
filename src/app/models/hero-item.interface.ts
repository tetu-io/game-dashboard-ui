import { HeroEntity } from '../../../generated/gql';

export interface HeroItemInterface extends HeroEntity {
  dungeonCount: number;
  battleCount: number;
  eventCount: number;
  storyCount: number;
  earn: number;
}