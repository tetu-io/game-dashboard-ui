import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeroEntity } from '../../../../generated/gql';
import { SubgraphService } from '../../services/subgraph.service';
import { DestroyService } from '../../services/destroy.service';
import { finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroDetailsComponent implements OnInit {

  id = ''
  data: HeroEntity | undefined;
  isLoading = false;

  constructor(
    private subgraphService: SubgraphService,
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(() => {
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  prepareData(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.isLoading = true;
      this.subgraphService.heroById$(this.id)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
          }),
          takeUntil(this.destroy$))
        .subscribe(hero => {
          if (hero) {
            this.data = hero as HeroEntity;
          }
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        })
    });
  }

}
