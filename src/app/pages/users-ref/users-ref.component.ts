import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubgraphService } from '../../services/subgraph.service';
import { DestroyService } from '../../services/destroy.service';
import { takeUntil } from 'rxjs';
import { UsersRefStat } from '../../models/users-ref-stat.interface';

@Component({
  selector: 'app-users-ref',
  templateUrl: './users-ref.component.html',
  styleUrls: ['./users-ref.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersRefComponent implements OnInit {

  columns = ['Referral Code', 'Count', 'Get lvl 2', 'Get lvl 5', 'Passed 1 biome'];
  records: Record<string, number> = {};
  recordStat: Record<string, UsersRefStat> = {};

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

            if (!this.recordStat[hero.refCode]) {
              this.recordStat[hero.refCode] = {
                lvlTwo: 0,
                lvlFive: 0,
                passFirstBiome: 0,
              };
            }

            if (this.recordStat[hero.refCode]) {
              if (hero.stats.level > 2) {
                this.recordStat[hero.refCode].lvlTwo += 1;
              }
              if (hero.stats.level > 5) {
                this.recordStat[hero.refCode].lvlFive += 1;
              }
              if (hero.biome > 1) {
                this.recordStat[hero.refCode].passFirstBiome += 1;
              }
            }
          }
        });

        this.records = Object.entries(this.records)
          .sort(([, a], [, b]) => b - a)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

        this.keys = Object.keys(this.records);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }
}
