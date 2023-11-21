import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStatComponent } from './user-stat.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UserStatRoutingModule } from './user-stat-routing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';


@NgModule({
  declarations: [
    UserStatComponent
  ],
  imports: [
    CommonModule,
    NzTableModule,
    UserStatRoutingModule,
    NzSpinModule,
  ],
})
export class UserStatModule {
}
