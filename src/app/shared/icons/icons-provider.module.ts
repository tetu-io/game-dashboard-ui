import { NgModule } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline,
} from '@ant-design/icons-angular/icons';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { TetuLogoIcon } from './TetuLogoIcon';
import { MoonIcon } from './MoonIcon';
import { SacraLogoIcon } from './SacraLogoIcon';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};

const nzIcons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

const ICONS = [
  ...nzIcons,
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  FormOutline,
  TetuLogoIcon,
  MoonIcon,
  SacraLogoIcon
];

@NgModule({
  imports: [NzIconModule],
  exports: [NzIconModule],
  providers: [
    { provide: NZ_ICONS, useValue: ICONS },
  ],
})
export class IconsProviderModule {
}
