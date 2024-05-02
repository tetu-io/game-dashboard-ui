import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { MenuItemInterface } from './models/menu-item.interface';
import { MENU } from './shared/constants/menu.constant';
import { StorageService } from './services/storage.service';
import { THEME_KEY } from './shared/constants/theme.constant';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DestroyService } from './services/destroy.service';
import { ThemeService } from './services/theme.service';
import { takeUntil } from 'rxjs';
import { MAIN_ROUTES } from './shared/constants/routes.constant';
import { defaultNetwork, isExcitingNetwork, NETWORKS } from './shared/constants/network.constant';
import { SubgraphService } from './services/subgraph.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @HostBinding('class.dark-theme')
  get getIsDarkTheme(): boolean {
    this.isLight = this.storageService.get(THEME_KEY);

    return !this.isLight;
  }

  private isFirstLoad = true;

  form: FormGroup = this.fb.group({
    network: this.fb.control(defaultNetwork())
  });

  themeControl: FormControl = new FormControl();
  MENU_ITEMS: { [key: string]: MenuItemInterface } = MENU;
  MAIN_ROUTES_ITEMS: { [key: string]: string } = MAIN_ROUTES;
  menuItemsKeys: string[] = [];
  isLight: boolean = false;
  networks = Object.keys(NETWORKS);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private storageService: StorageService,
    private destroy$: DestroyService,
    private themeService: ThemeService,
    private fb: FormBuilder,
    private subgraphService: SubgraphService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuItemsKeys = Object.keys(MENU);

    this.themeControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.themeService.switchTheme(this.themeControl.value);

        this.changeDetectorRef.detectChanges();
      });

    this.themeControl.setValue(this.isLight, { emitEvent: false });
  }

  ngAfterViewInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.handleQueryParams(params);
      });
  }

  getSubMenuKeys(itemKey: string): string[] {
    return Object.keys(MENU[itemKey].subMenu);
  }

  networkChange(value: string): void {
    this.updateNetworkQueryParam(value)
    this.subgraphService.changeNetwork(value);
  }

  handleQueryParams(params: any) {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
    } else {
      const network = params['network'];
      if (!network || !isExcitingNetwork(network)) {
      } else {
        this.form.setValue({ network: network });
      }
      this.updateNetworkQueryParam(network);
    }
  }

  updateNetworkQueryParam(value: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { network: value },
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }
}
