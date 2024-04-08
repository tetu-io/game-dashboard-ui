import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MAIN_ROUTES } from './shared/constants/routes.constant';
import { MENU_ITEMS } from './shared/constants/menu.constant';

const routes: Routes = [
  {
    path: MAIN_ROUTES[MENU_ITEMS.USER_STAT],
    loadChildren: () => import('./pages/user-stat/user-stat.module').then(m => m.UserStatModule),
  },
  {
    path: MAIN_ROUTES[MENU_ITEMS.HERO_STAT],
    loadChildren: () => import('./pages/hero-stat/hero-stat.module').then(m => m.HeroStatModule),
  },
  {
    path: MAIN_ROUTES[MENU_ITEMS.ITEM_STAT],
    loadChildren: () => import('./pages/item-stat/item-stat.module').then(m => m.ItemStatModule),
  },
  {
    path: MAIN_ROUTES[MENU_ITEMS.NEW_USERS],
    loadChildren: () => import('./pages/new-users/new-users.module').then(m => m.NewUsersModule),
  },
  {
    path: MAIN_ROUTES[MENU_ITEMS.NEW_HEROES],
    loadChildren: () => import('./pages/new-heroes/new-heroes.module').then(m => m.NewHeroesModule),
  },
  {
    path: MAIN_ROUTES[MENU_ITEMS.STORY_STAT],
    loadChildren: () => import('./pages/story-stat/story-stat.module').then(m => m.StoryStatModule),
  },
  {
    path: MAIN_ROUTES[MENU_ITEMS.TOKENOMICS],
    loadChildren: () => import('./pages/tokenomics/tokenomics.module').then(m => m.TokenomicsModule),
  },
  {
    path: MAIN_ROUTES[MENU_ITEMS.TOKENOMICS_CHART],
    loadChildren: () => import('./pages/tokenomics-stat/tokenomics-stat.module').then(m => m.TokenomicsStatModule),
  },
  {
    path: MAIN_ROUTES[MENU_ITEMS.TOKENS_TRANSACTIONS],
    loadChildren: () => import('./pages/token-transactions/token-transactions.module').then(m => m.TokenTransactionsModule),
  },
  {
    path: MAIN_ROUTES[MENU_ITEMS.USER_GENERAL_STAT],
    loadChildren: () => import('./pages/user-general-stat/user-general-stat.module').then(m => m.UserGeneralStatModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: MAIN_ROUTES[MENU_ITEMS.USER_STAT],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
