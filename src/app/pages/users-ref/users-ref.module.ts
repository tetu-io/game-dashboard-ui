import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRefComponent } from './users-ref.component';
import { UsersRefRoutingModule } from './users-ref-routing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';



@NgModule({
  declarations: [
    UsersRefComponent
  ],
  imports: [
    CommonModule,
    UsersRefRoutingModule,
    NzSpinModule,
    NzTableModule,
  ],
})
export class UsersRefModule { }
