import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubgraphService } from '../../services/subgraph.service';
import { DestroyService } from '../../services/destroy.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-users-ref',
  templateUrl: './users-ref.component.html',
  styleUrls: ['./users-ref.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersRefComponent implements OnInit {

  columns = ['Referral Code', 'Count'];
  records: Record<string, number> = {};
  keys: string[] = [];
  isLoading = false;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
  ) { }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(() => {
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  prepareData(): void {
    this.subgraphService.fetchHeroesWithRefCode$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(heroes => {

        heroes.forEach(hero => {
          if (hero.refCode) {
            if (this.records[hero.refCode]) {
              this.records[hero.refCode] += 1;
            } else {
              this.records[hero.refCode] = 1;
            }
          }
        })

        this.keys = Object.keys(this.records);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }
}
