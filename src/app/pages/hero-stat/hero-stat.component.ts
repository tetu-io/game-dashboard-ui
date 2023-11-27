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
      name: 'Score',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.score - b.score,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Items count',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.earnedItems.length - b.earnedItems.length,
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
    {
      name: 'Earned',
      sortFn: (a: HeroItemInterface, b: HeroItemInterface) => a.earn - b.earn,
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  topSize = '10';
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

            const earn =
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


            const tokenSums: { [key: string]: number } = {};
            hero.earnedTokens.forEach((item) => {
              let amount = 0;
              const token = item.token;
              if (+item.amount > 0) {
                if (item.reinforcementStakedFee > 0) {
                  amount = +item.amount / (10 ** 18) * ((100 - item.reinforcementStakedFee) / 100);
                }
                amount = +item.amount / (10 ** 18)
              }
              const tokenName = token.name;
              if (tokenSums[tokenName]) {
                tokenSums[tokenName] += amount;
              } else {
                tokenSums[tokenName] = amount;
              }

              // average logic
              if (tokenSumCounts[tokenName]) {
                tokenSumCounts[tokenName].sum += amount;
              } else {
                tokenSumCounts[tokenName] = { sum: amount };
              }
            });

            const tokenList = Object.keys(tokenSums);
            const earnedList = Object.values(tokenSums);

            return {
              ...hero,
              battleCount,
              eventCount,
              storyCount,
              dungeonCount,
              tokenList,
              earn,
              earnedList,
              tokenSums
            } as HeroItemInterface;
          });

          const totalCounts = {
            itemCount: 0,
            dungeonCount: 0,
            battleCount: 0,
            eventCount: 0,
            storyCount: 0,
            earnCount: 0
          };

          this.data.forEach(hero => {
            totalCounts.itemCount += hero.earnedItems.length;
            totalCounts.dungeonCount += hero.dungeonCount;
            totalCounts.battleCount += hero.battleCount;
            totalCounts.eventCount += hero.eventCount;
            totalCounts.storyCount += hero.storyCount;
            totalCounts.earnCount += hero.earn
          });

          const averages = {
            itemAverage: this.data.length > 0 ? totalCounts.itemCount / this.data.length : 0,
            dungeonAverage: this.data.length > 0 ? totalCounts.dungeonCount / this.data.length : 0,
            battleAverage: this.data.length > 0 ? totalCounts.battleCount / this.data.length : 0,
            eventAverage: this.data.length > 0 ? totalCounts.eventCount / this.data.length : 0,
            storyAverage: this.data.length > 0 ? totalCounts.storyCount / this.data.length : 0,
            earnAverage: this.data.length > 0 ? totalCounts.earnCount / this.data.length : 0,
          };


          // earn average logic
          const tokenAverages: { [key: string]: number } = {};
          for (const token in tokenSumCounts) {
            if (tokenSumCounts.hasOwnProperty(token)) {
              const { sum } = tokenSumCounts[token];
              tokenAverages[token] = +(sum / this.data.filter(a => a.earn > 0).length).toFixed(2);
            }
          }

          let tokenAverageColumn = '';
          for (const token in tokenAverages) {
            if (tokenAverages.hasOwnProperty(token)) {
              tokenAverageColumn = tokenAverageColumn + `average ~ ${tokenAverages[token]} ${token}\n`;
            }
          }

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
              column.name = `Earned, (${tokenAverageColumn})`;
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
