import { MenuItemInterface } from '../../models/menu-item.interface';

export enum MENU_ITEMS {
  USERS = 'Users',
  USER_STAT = 'User stats',
  NEW_USERS = 'New users',
  HEROES = 'Heroes',
  HERO_STAT = 'Hero stats',
  HERO_DETAILS = 'Hero details',
  NEW_HEROES = 'New heroes',
  ITEM_STAT = 'Item stats',
  STORY_STAT = 'Story stats',
  TOKENOMICS = 'Tokenomics',
}

export const MENU: { [key: string]: MenuItemInterface } = {
  [MENU_ITEMS.TOKENOMICS]: {
    icon: 'line-chart',
    label: MENU_ITEMS.TOKENOMICS,
  },
  [MENU_ITEMS.USERS]: {
    icon: 'line-chart',
    label: MENU_ITEMS.USERS,
    subMenu: {
      [MENU_ITEMS.USER_STAT]: {
        icon: 'line-chart',
        label: MENU_ITEMS.USER_STAT
      },
      [MENU_ITEMS.NEW_USERS]: {
        icon: 'line-chart',
        label: MENU_ITEMS.NEW_USERS
      },
    }
  },
  [MENU_ITEMS.HEROES]: {
    icon: 'line-chart',
    label: MENU_ITEMS.HEROES,
    subMenu: {
      [MENU_ITEMS.HERO_STAT]: {
        icon: 'line-chart',
        label: MENU_ITEMS.HERO_STAT
      },
      [MENU_ITEMS.NEW_HEROES]: {
        icon: 'line-chart',
        label: MENU_ITEMS.NEW_HEROES
      },
    }
  },
  [MENU_ITEMS.ITEM_STAT]: {
    icon: 'line-chart',
    label: MENU_ITEMS.ITEM_STAT,
  },
  [MENU_ITEMS.STORY_STAT]: {
    icon: 'line-chart',
    label: MENU_ITEMS.STORY_STAT,
  }
};