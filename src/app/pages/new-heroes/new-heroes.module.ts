import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewHeroesComponent } from './new-heroes.component';
import { NewHeroesRoutingModule } from './new-heroes-routing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzEmptyModule } from 'ng-zorro-antd/empty';


@NgModule({
  declarations: [
    NewHeroesComponent
  ],
  imports: [
    CommonModule,
    NewHeroesRoutingModule,
    NzSpinModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzEmptyModule,
  ],
})
export class NewHeroesModule { }
