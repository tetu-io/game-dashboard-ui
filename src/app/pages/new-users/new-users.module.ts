import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewUsersComponent } from './new-users.component';
import { NewUsersRoutingModule } from './new-users-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    NewUsersComponent
  ],
  imports: [
    CommonModule,
    NewUsersRoutingModule,
    NzEmptyModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzSpinModule,
  ],
})
export class NewUsersModule { }
