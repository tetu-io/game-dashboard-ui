import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenTransactionsComponent } from './token-transactions.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TokenTransactionsRoutingModule } from './token-transactions-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';



@NgModule({
  declarations: [
    TokenTransactionsComponent
  ],
  imports: [
    CommonModule,
    NzSpinModule,
    TokenTransactionsRoutingModule,
    NzTableModule,
  ],
})
export class TokenTransactionsModule { }
