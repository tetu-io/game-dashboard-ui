import { HeroEntity } from '../../../generated/gql';

export interface HeroItemInterface extends HeroEntity {
  dungeonCount: number;
  battleCount: number;
  eventCount: number;
  storyCount: number;
  earnTokens: number;
  // tokenList: string[];
  // earnedList: number[];
  // tokenSums: { [key: string]: number };
  spentTokens: number;
  ratio: number;
}