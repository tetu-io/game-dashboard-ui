import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { HeroEntity } from '../../../../generated/gql';
import { ColumnItem } from '../../models/column-item.interface';
import { takeUntil } from 'rxjs';
import { DEFAULT_TABLE_SIZE } from '../../shared/constants/table.constant';
import { Router } from '@angular/router';
import { HeroItemInterface } from '../../models/hero-item.interface';

@Component({
  selector: 'app-hero-stat',
  templateUrl: './hero-stat.component.html',
  styleUrls: ['./hero-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroStatComponent implements OnInit {
  columns: ColumnItem<HeroItemInterface>[] = [
    {
      name: 'ID',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.id.localeCompare(b.id),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Name',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.uniqName.localeCompare(b.uniqName),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Level',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.stats.level - b.stats.level,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Score',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.score - b.score,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Items count',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.items.length - b.items.length,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Dungeon count',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.dungeonCount - b.dungeonCount,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Battle count',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.battleCount - b.battleCount,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Event count',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.eventCount - b.eventCount,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Story count',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.storyCount - b.storyCount,
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  data: HeroItemInterface[] = [];
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
          this.data = (heroes as HeroEntity[]).map(hero => {
            const dungeon = new Set();
            const events = new Set();
            const stories = new Set();
            const battles = new Set();

            let battleCount = 0;
            let eventCount = 0;
            let storyCount = 0;
            let dungeonCount = 0;

            hero.openedChambers.forEach(openChamber => {
              if (openChamber.completed) {
                dungeon.add(openChamber.dungeon.id);
              }
              if (openChamber.chamber.isEvent) {
                events.add(openChamber.chamber.id)
              }
              if (openChamber.chamber.isStory) {
                stories.add(openChamber.chamber.id)
              }
              if (openChamber.chamber.isBattle) {
                battles.add(openChamber.chamber.id)
              }

              battleCount = battles.size;
              eventCount = events.size;
              storyCount = stories.size;
              dungeonCount = dungeon.size;
            })

            return {
              ...hero,
              battleCount,
              eventCount,
              storyCount,
              dungeonCount
            } as HeroItemInterface;
          });

          const totalCounts = {
            dungeonCount: 0,
            battleCount: 0,
            eventCount: 0,
            storyCount: 0
          };

          this.data.forEach(hero => {
            totalCounts.dungeonCount += hero.dungeonCount;
            totalCounts.battleCount += hero.battleCount;
            totalCounts.eventCount += hero.eventCount;
            totalCounts.storyCount += hero.storyCount;
          });

          const averages = {
            dungeonAverage: this.data.length > 0 ? totalCounts.dungeonCount / this.data.length : 0,
            battleAverage: this.data.length > 0 ? totalCounts.battleCount / this.data.length : 0,
            eventAverage: this.data.length > 0 ? totalCounts.eventCount / this.data.length : 0,
            storyAverage: this.data.length > 0 ? totalCounts.storyCount / this.data.length : 0
          };

          this.columns.forEach(column => {
            if (column.name == 'Dungeon count') {
              column.name = `Dungeon count, (average ~ ${Math.round(averages.dungeonAverage)})`;
            }
            if (column.name == 'Battle count') {
              column.name = `Battle count, (average ~ ${Math.round(averages.battleAverage)})`;
            }
            if (column.name == 'Event count') {
              column.name = `Event count, (average ~ ${Math.round(averages.eventAverage)})`;
            }
            if (column.name == 'Story count') {
              column.name = `Story count, (average ~ ${Math.round(averages.storyAverage)})`;
            }
          })
        }
        this.changeDetectorRef.detectChanges();
      })
  }

  gotoHeroDetails(heroId: string) {
    this.router.navigate(['/hero-details', heroId]);
  }
}
