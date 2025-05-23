import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OpenedChamberEntity, OrderDirection } from '../../../../generated/gql';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { ColumnItem } from '../../models/column-item.interface';
import { getMonsterName, MONSTER_NAMES } from '../../shared/constants/game.constant';
import { getChainId, NETWORKS_URLS } from '../../shared/constants/network.constant';
import { takeUntil } from 'rxjs';
import { HEROES_CLASSES } from '../../shared/constants/heroes.constant';
import { FormBuilder, FormGroup } from '@angular/forms';

interface HeroBattleInfo {
  heroName: string;
  monster: string;
  status: string;
  heroClass: string;
  link: string;
  type: string;
  biome: string;
  date: number;
}

@Component({
  selector: 'app-hero-fights',
  templateUrl: './hero-fights.component.html',
  styleUrls: ['./hero-fights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroFightsComponent implements OnInit {

  columns: ColumnItem<HeroBattleInfo>[] = [
    {
      name: 'Hero name',
      sortFn: (a: HeroBattleInfo, b: HeroBattleInfo) => a.heroName.localeCompare(b.heroName),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Monster name',
      sortFn: (a: HeroBattleInfo, b: HeroBattleInfo) => a.monster.localeCompare(b.monster),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Hero class',
      sortFn: (a: HeroBattleInfo, b: HeroBattleInfo) => a.heroClass.localeCompare(b.heroClass),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Status',
      sortFn: (a: HeroBattleInfo, b: HeroBattleInfo) => a.status.localeCompare(b.status),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Type',
      sortFn: (a: HeroBattleInfo, b: HeroBattleInfo) => a.type.localeCompare(b.type),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Biome',
      sortFn: (a: HeroBattleInfo, b: HeroBattleInfo) => a.biome.localeCompare(b.biome),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Link',
      sortFn: (a: HeroBattleInfo, b: HeroBattleInfo) => a.link.localeCompare(b.link),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Date',
      sortFn: null,
      sortDirections: ['ascend', 'descend'],
    }
  ];

  heroList: Array<{ label: string; value: string }> = [];
  selectedHeroes: string[] = [];

  biomes = [1,2,3,4,5]
  biome: string = 'All';

  form: FormGroup = this.fb.group({
    size: this.fb.control(this.biome)
  });

  isLoading = false;
  network: string = '';
  chainId: number = 0;
  pageSize = 100;
  heroBattleInfos: HeroBattleInfo[] = [];
  currentPage = 0;
  currentOrder: OrderDirection = OrderDirection.Desc;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(network => {
      this.network = network;
      this.chainId = getChainId(network);
      this.isLoading = true;
      this.subgraphService.fetchAllHeroesSimple$(this.destroy$)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(data => {
          if (data) {
            this.heroList = this.heroList.concat((data as any[]).map(hero => {
              return { label: hero.uniqName, value: hero.id + '' };
            }));
          }
          this.prepareData();
          this.changeDetectorRef.detectChanges();
        });
    });
  }

  prepareData(): void {
    const skip = this.pageSize * this.currentPage;
    (
      this.selectedHeroes.length > 0 ?
        this.subgraphService.openChamberByHeroes$(this.pageSize, skip, this.selectedHeroes, this.currentOrder, this.biomes) :
        this.subgraphService.openChamber$(this.pageSize, skip, this.currentOrder, this.biomes)
    )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        if (data) {
          this.heroBattleInfos = (data as OpenedChamberEntity[]).map(chamber => {
            let status = '';
            if (!chamber.completed) {
              status = 'In progress';
            } else if (chamber.actions.length > 0 && !chamber.actions[0].kill && chamber.actions[0].completed) {
              status = 'Won';
            } else {
              status = 'Lose';
            }
            const prePayment = chamber.enteredHero.meta.feeToken.token.id === chamber.enteredHero.lastPayToken.id;
            return {
              heroName: chamber.enteredHero.uniqName,
              monster: `${getMonsterName(+chamber.chamber.id)} (${chamber.chamber.id})`,
              heroClass: HEROES_CLASSES.get(chamber.enteredHero.meta.heroClass + '') || '',
              status: status,
              type: prePayment ? 'NG-' + chamber.dungeon.ngLevel : 'Post Payment',
              link: this.createFightUrl(chamber),
              date: +chamber.timestamp * 1000,
              biome: chamber.chamber.biome + '',
            };
          });
        }
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }

  selectMonster(data: string[]): void {
    this.selectedHeroes = data;
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

  biomeChange(value: string): void {
    this.biome = value;
    if (value === 'All') {
      this.biomes = [1,2,3,4]
    } else {
      this.biomes = [parseInt(value)];
    }
    this.prepareData();
  }

}
