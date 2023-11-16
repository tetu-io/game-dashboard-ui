import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStatComponent } from './user-stat.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UserStatRoutingModule } from './user-stat-routing.module';


@NgModule({
  declarations: [
    UserStatComponent
  ],
  imports: [
    CommonModule,
    NzTableModule,
    UserStatRoutingModule
  ]
})
export class UserStatModule {
}
