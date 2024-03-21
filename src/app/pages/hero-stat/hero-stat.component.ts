import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { HeroEntity } from '../../../../generated/gql';
import { ColumnItem } from '../../models/column-item.interface';
import { takeUntil } from 'rxjs';
import { DEFAULT_TABLE_SIZE } from '../../shared/constants/table.constant';
import { Router } from '@angular/router';
import { HeroItemInterface } from '../../models/hero-item.interface';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NETWORKS_URLS } from '../../shared/constants/network.constant';

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
      name: 'Life Chance',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.stats.lifeChances - b.stats.lifeChances,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Score',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.score - b.score,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Items minted',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.earnedItems.length - b.earnedItems.length,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Dungeon passed',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.dungeonCount - b.dungeonCount,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Battle passed',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.battleCount - b.battleCount,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Event passed',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.eventCount - b.eventCount,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Story passed',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.storyCount - b.storyCount,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Earned',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.earnTokens - b.earnTokens,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Spent',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.spentTokens - b.spentTokens,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Ratio',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.ratio - b.ratio,
      sortDirections: ['ascend', 'descend', null],
    }
  ];

  topSize = '100';
  isLoading = false;
  network = '';

  form: FormGroup = this.fb.group({
    size: this.fb.control(this.topSize)
  });

  data: HeroItemInterface[] = [];
  tableData: HeroItemInterface[] = [];
  pageSize = DEFAULT_TABLE_SIZE;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(network => {
      this.isLoading = true;
      this.network = network;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  prepareData(): void {
    this.isLoading = true;
    this.subgraphService.heroes$(+this.topSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe(heroes => {
        if (heroes) {
          const tokenSumCounts: { [key: string]: { sum: number } } = {};

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

            const earnTokens =
              +(hero.earnedTokens.map(val => {
                if (+val.amount > 0) {
                  if (val.reinforcementStakedFee > 0) {
                    return +val.amount / (10 ** 18) * ((100 - val.reinforcementStakedFee) / 100);
                  }
                  return +val.amount / (10 ** 18)
                }
                return 0;
              }).reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
              }, 0)).toFixed(2);

            let spentTokens = 0;
            for (let i = 1; i <= hero.stats.level; i++) {
              spentTokens += (i * +hero.meta.feeToken.amount);
            }

            const ratio = +((spentTokens / earnTokens)).toFixed(2);
            return {
              ...hero,
              battleCount,
              eventCount,
              storyCount,
              dungeonCount,
              earnTokens,
              spentTokens,
              ratio
            } as HeroItemInterface;
          });

          const totalCounts = {
            itemCount: 0,
            dungeonCount: 0,
            battleCount: 0,
            eventCount: 0,
            storyCount: 0,
            earnCount: 0,
            spentCount: 0,
            rationCount: 0
          };

          this.data.forEach(hero => {
            totalCounts.itemCount += hero.earnedItems.length;
            totalCounts.dungeonCount += hero.dungeonCount;
            totalCounts.battleCount += hero.battleCount;
            totalCounts.eventCount += hero.eventCount;
            totalCounts.storyCount += hero.storyCount;
            totalCounts.earnCount += hero.earnTokens;
            totalCounts.spentCount += hero.spentTokens;
            totalCounts.rationCount += hero.ratio;
          });

          const averages = {
            itemAverage: this.data.length > 0 ? totalCounts.itemCount / this.data.length : 0,
            dungeonAverage: this.data.length > 0 ? totalCounts.dungeonCount / this.data.length : 0,
            battleAverage: this.data.length > 0 ? totalCounts.battleCount / this.data.length : 0,
            eventAverage: this.data.length > 0 ? totalCounts.eventCount / this.data.length : 0,
            storyAverage: this.data.length > 0 ? totalCounts.storyCount / this.data.length : 0,
            earnAverage: this.data.length > 0 ? totalCounts.earnCount / this.data.length : 0,
            spentAverage: this.data.length > 0 ? totalCounts.spentCount / this.data.length : 0,
            ratioAverage: this.data.length > 0 ? totalCounts.rationCount / this.data.length : 0
          };


          this.columns.forEach(column => {
            if (column.name.startsWith('Items count')) {
              column.name = `Items count, (average ~ ${Math.round(averages.itemAverage)})`;
            }
            if (column.name.startsWith('Dungeon count')) {
              column.name = `Dungeon count, (average ~ ${Math.round(averages.dungeonAverage)})`;
            }
            if (column.name.startsWith('Battle count')) {
              column.name = `Battle count, (average ~ ${Math.round(averages.battleAverage)})`;
            }
            if (column.name.startsWith('Event count')) {
              column.name = `Event count, (average ~ ${Math.round(averages.eventAverage)})`;
            }
            if (column.name.startsWith('Story count')) {
              column.name = `Story count, (average ~ ${Math.round(averages.storyAverage)})`;
            }
            if (column.name.startsWith('Earned')) {
              column.name = `Earned, (average ~ ${Math.round(averages.earnAverage)})`;
            }
            if (column.name.startsWith('Spent')) {
              column.name = `Spent, (average ~ ${Math.round(averages.spentAverage)})`;
            }
            if (column.name.startsWith('Ratio')) {
              column.name = `Ratio, (average ~ ${averages.ratioAverage})`;
            }
          })
          this.tableData = this.data.sort((a, b) => b.stats.level - a.stats.level).slice(0, +this.topSize);
        }
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }

  goToHeroDetails(address: string, heroId: number) {
    const url = NETWORKS_URLS.get(this.network) + '/hero/' + address + '/' + heroId + '/stats';
    window.open(url, '_blank');
  }

  sizeChange(value: string): void {
    this.topSize = value;
    this.prepareData();
  }
}
