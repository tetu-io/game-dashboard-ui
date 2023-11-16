import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';

import { StorageService } from './storage.service';
import { THEME_KEY } from '../shared/constants/theme.constant';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public themeChange$: Subject<boolean> = new Subject();
  private renderer: Renderer2;
  private isLight: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private rendererFactory: RendererFactory2,
    private storageService: StorageService,
  ) {
    this.isLight = Boolean(this.storageService.get(THEME_KEY));
    this.renderer = rendererFactory.createRenderer(null, null);

    this.addDarkThemeClass();
  }

  public switchTheme(isLight: boolean) {
    this.isLight = isLight;

    this.themeChange$.next(isLight);

    this.storageService.set(THEME_KEY, isLight);

    this.addDarkThemeClass();
  }

  private addDarkThemeClass() {
    if (!this.isLight) {
      this.renderer.addClass(this.document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
    }
  }
}
