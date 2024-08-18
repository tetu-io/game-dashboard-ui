import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { getChainId, NETWORKS_URLS } from '../../shared/constants/network.constant';
import { ColumnItem } from '../../models/column-item.interface';
import { OpenedChamberEntity, OrderDirection } from '../../../../generated/gql';
import { finalize, takeUntil } from 'rxjs';
import { getMonsterName, MONSTER_NAMES } from '../../shared/constants/game.constant';

interface MonsterBattleInfo {
  monster: string;
  status: string;
  link: string;
  date: number;
}

@Component({
  selector: 'app-monster-fights',
  templateUrl: './monster-fights.component.html',
  styleUrls: ['./monster-fights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonsterFightsComponent implements OnInit {

  columns: ColumnItem<MonsterBattleInfo>[] = [
    {
      name: 'Monster name',
      sortFn: (a: MonsterBattleInfo, b: MonsterBattleInfo) => a.monster.localeCompare(b.monster),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Status',
      sortFn: (a: MonsterBattleInfo, b: MonsterBattleInfo) => a.status.localeCompare(b.status),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Link',
      sortFn: (a: MonsterBattleInfo, b: MonsterBattleInfo) => a.link.localeCompare(b.link),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Date',
      sortFn: null,
      sortDirections: ['ascend', 'descend'],
    }
  ];

  monsterList: Array<{ label: string; value: string }> = [];
  selectedMonsters: string[] = [];

  isLoading = false;
  network: string = '';
  chainId: number = 0;
  pageSize = 100;
  monsterBattleInfos: MonsterBattleInfo[] = [];
  currentPage = 0;
  currentOrder: OrderDirection = OrderDirection.Desc;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
  ) { }

  ngOnInit(): void {
    const tempList: Array<{ label: string; value: string }> = [];
    for (const [key, value] of MONSTER_NAMES) {
      tempList.push({ label: `${value} (${key})`, value: key + '' });
    }
    this.monsterList = tempList;
    this.subgraphService.networkObserver.subscribe(network => {
      this.network = network;
      this.chainId = getChainId(network);
      this.prepareData();
    });
  }

  prepareData(): void {
    this.isLoading = true;
    const skip = this.pageSize * this.currentPage;
    (
      this.selectedMonsters.length > 0 ?
        this.subgraphService.openChamberByChambers$(this.pageSize, skip, this.selectedMonsters, this.currentOrder) :
        this.subgraphService.openChamber$(this.pageSize, skip, this.currentOrder)
    )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        if (data) {
          this.monsterBattleInfos = (data as OpenedChamberEntity[]).map(chamber => {
            let status = '';
            if (!chamber.completed) {
              status = 'In progress';
            } else if (chamber.actions.length > 0 && !chamber.actions[0].kill) {
              status = 'Won';
            } else {
              status = 'Lose';
            }
            return {
              monster: `${getMonsterName(+chamber.chamber.id)} (${chamber.chamber.id})`,
              status: status,
              link: this.createFightUrl(chamber),
              date: +chamber.timestamp * 1000
            };
          });
        }
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }

  selectMonster(data: string[]): void {
    this.selectedMonsters = data;
    this.currentPage = 0;
    this.prepareData();
  }

  createFightUrl(data: OpenedChamberEntity): string {
    const url = NETWORKS_URLS.get(this.network) || '';
    return `${url}/dungeon/${data.enteredHero.meta.id}/${data.enteredHero.heroId}/fight/${data.dungeon.id}/${data.chamber.id}/${data.stage}/${data.iteration}`;
  }

  next(): void {
    this.currentPage++;
    this.prepareData();
  }

  prev(): void {
    this.currentPage--;
    this.prepareData();
  }

  sort(name: string): void {
    this.currentOrder = this.currentOrder === OrderDirection.Asc ? OrderDirection.Desc : OrderDirection.Asc;
    this.prepareData();
  }

  getFormattedDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 16).replace('T', ' ');
  }
}
