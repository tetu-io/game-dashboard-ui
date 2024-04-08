import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenTransactionsComponent } from './token-transactions.component';


const routes: Routes = [
  { path: '', component: TokenTransactionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TokenTransactionsRoutingModule { }