import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { MenuItemInterface } from './models/menu-item.interface';
import { MENU } from './shared/constants/menu.constant';
import { StorageService } from './services/storage.service';
import { THEME_KEY } from './shared/constants/theme.constant';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DestroyService } from './services/destroy.service';
import { ThemeService } from './services/theme.service';
import { takeUntil } from 'rxjs';
import { MAIN_ROUTES } from './shared/constants/routes.constant';
import { NETWORKS } from './shared/constants/network.constant';
import { SubgraphService } from './services/subgraph.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @HostBinding('class.dark-theme')
  get getIsDarkTheme(): boolean {
    this.isLight = this.storageService.get(THEME_KEY);

    return !this.isLight;
  }

  form: FormGroup = this.fb.group({
    network: this.fb.control(NETWORKS.sepolia)
  });

  themeControl: FormControl = new FormControl();
  MENU_ITEMS: { [key: string]: MenuItemInterface } = MENU;
  MAIN_ROUTES_ITEMS: { [key: string]: string } = MAIN_ROUTES;
  menuItemsKeys: string[] = [];
  isLight: boolean = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private storageService: StorageService,
    private destroy$: DestroyService,
    private themeService: ThemeService,
    private fb: FormBuilder,
    private subgraphService: SubgraphService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
       const network = params['network'];
    });
    this.menuItemsKeys = Object.keys(MENU);

    this.themeControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.themeService.switchTheme(this.themeControl.value);

        this.changeDetectorRef.detectChanges();
      });

    this.themeControl.setValue(this.isLight, { emitEvent: false });
  }

  getSubMenuKeys(itemKey: string): string[] {
    return Object.keys(MENU[itemKey].subMenu);
  }

  networkChange(value: string): void {
    this.subgraphService.changeNetwork(value);
  }
}
