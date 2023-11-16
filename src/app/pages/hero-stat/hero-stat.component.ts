import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { HeroEntity } from '../../../../generated/gql';
import { ColumnItem } from '../../models/column-item.interface';
import { takeUntil } from 'rxjs';
import { DEFAULT_TABLE_SIZE } from '../../shared/constants/table.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-stat',
  templateUrl: './hero-stat.component.html',
  styleUrls: ['./hero-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroStatComponent implements OnInit {
  columns: ColumnItem<HeroEntity>[] = [
    {
      name: 'ID',
      sortFn: (a: HeroEntity, b: HeroEntity) => a.id.localeCompare(b.id),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Name',
      sortFn: (a: HeroEntity, b: HeroEntity) => a.uniqName.localeCompare(b.uniqName),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Level',
      sortFn: (a: HeroEntity, b: HeroEntity) => a.stats.level - b.stats.level,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Score',
      sortFn: (a: HeroEntity, b: HeroEntity) => a.score - b.score,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Items count',
      sortFn: (a: HeroEntity, b: HeroEntity) => a.items.length - b.items.length,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Owner',
      sortFn: (a: HeroEntity, b: HeroEntity) => a.owner.id.localeCompare(b.owner.id),
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  data: HeroEntity[] = [];
  pageSize = DEFAULT_TABLE_SIZE;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subgraphService.heroes$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(heroes => {
        if (heroes) {
          this.data = heroes as HeroEntity[];
        }
        this.changeDetectorRef.detectChanges();
      })
  }

  gotoHeroDetails(heroId: string) {
    this.router.navigate(['/hero-details', heroId]);
  }
}
