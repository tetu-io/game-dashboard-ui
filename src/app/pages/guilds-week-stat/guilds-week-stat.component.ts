import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColumnItem } from '../../models/column-item.interface';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { getChainId } from '../../shared/constants/network.constant';
import {
  formatDateFromTimestamp,
  getCurrentWeek,
  getStartEpochOfWeek,
  SECONDS_IN_WEEK,
} from '../../shared/utils/time-utils';
import {
  catchError,
  defer,
  EMPTY,
  expand,
  first,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';
import { GET_CORE_ADDRESSES } from '../../shared/constants/addresses.constant';
import { formatUnits } from 'ethers';
import { PvpGuildEntity } from '../../../../generated/gql';

interface GuildInfo {
  biome: number;
  id: string;
  name: string;
  weekWin: number;
  totalEarned: number;
  taxPercent: number;
  totalEarnedItems: number;
}

const START_PVP_WEEK = 2876;
const MAX_BIOME = 5;

@Component({
  selector: 'app-guilds-week-stat',
  templateUrl: './guilds-week-stat.component.html',
  styleUrls: ['./guilds-week-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuildsWeekStatComponent implements OnInit {

  columns: ColumnItem<GuildInfo>[] = [
    {
      name: 'Biome',
      sortFn: (a: GuildInfo, b: GuildInfo) => a.biome - b.biome,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Id',
      sortFn: (a: GuildInfo, b: GuildInfo) => a.id.localeCompare(b.id),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Guild name',
      sortFn: (a: GuildInfo, b: GuildInfo) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Week win',
      sortFn: (a: GuildInfo, b: GuildInfo) => a.weekWin - b.weekWin,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Total earned',
      sortFn: (a: GuildInfo, b: GuildInfo) => a.totalEarned - b.totalEarned,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Tax percent',
      sortFn: (a: GuildInfo, b: GuildInfo) => a.taxPercent - b.taxPercent,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Total earned items',
      sortFn: (a: GuildInfo, b: GuildInfo) => a.totalEarnedItems - b.totalEarnedItems,
      sortDirections: ['ascend', 'descend', null],
    },
  ];


  data: GuildInfo[] = [];
  prevWeek = 0;
  startTimestamp = 0;
  endTimestamp = 0;
  isLoading = false;
  network: string = '';
  chainId: number = 0;
  pageSize = 100;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
  ) { }

  ngOnInit(): void {
    this.prevWeek = getCurrentWeek() - 1;
    this.subgraphService.networkObserver.subscribe(network => {
      this.network = network;
      this.chainId = getChainId(network);
      this.prepareData();
    });
  }

  prepareData(): void {
    this.isLoading = true;
    this.startTimestamp = getStartEpochOfWeek(this.prevWeek * SECONDS_IN_WEEK);
    this.endTimestamp = this.startTimestamp + SECONDS_IN_WEEK;

    const biomeRequests = Array.from({ length: MAX_BIOME }, (_, i) => {
      const biomeId: number = i + 1;
      const startWeek = this.prevWeek - 1;

      const fetchGuildWinner = (week: number): Observable<PvpGuildEntity[]> => {
        return this.subgraphService.guildWinner(week.toString(), biomeId, this.destroy$).pipe(
          map(res => (Array.isArray(res) ? res : [])),
          catchError(err => {
            return of([]);
          }),
          map(res => {
            if (res.length > 0 || week <= 2876) {
              return res;
            }
            return fetchGuildWinner(week - 1);
          }),
          switchMap(res => (res instanceof Observable ? res : of(res)))
        );
      };

      return defer(() => {
        return fetchGuildWinner(startWeek);
      });
    });

    forkJoin(biomeRequests)
      .pipe(
        switchMap(res => {
          return forkJoin({
            guilds: of(res),
            transactions: forkJoin(
              res.map(guild => guild.length > 0 ?
                this.subgraphService.fetchAllGuildTokenEarned$(guild[0].guild.id, this.startTimestamp + '', this.endTimestamp + '', this.destroy$) :
                of([]))
            ),
            items: forkJoin(
              res.map(guild => guild.length > 0 ?
                this.subgraphService.fetchAllGuildItemEarned$(guild[0].guild.id, this.startTimestamp + '', this.endTimestamp + '', this.destroy$) :
                of([]))
            )
          })
        }),
        takeUntil(this.destroy$))
      .subscribe(({ guilds, transactions, items }) => {
        this.data = guilds.map((guild, index) => {
          const totalEarned = transactions[index].reduce((sum, transaction) => sum + +formatUnits(BigInt(transaction.taxAmount || 0)), 0);
          const taxPercent = transactions.length > 0 && transactions[index][0] ? +(transactions[index][0].taxPercent || 0) : 0;
          return guild.length > 0 ? {
              biome: guild[0].biome,
              id: guild[0].guild.id,
              name: guild[0].guild.name,
              weekWin: +guild[0].epochWeek,
              totalEarned: +totalEarned.toFixed(2),
              taxPercent: taxPercent > 0 ? +(taxPercent / 1000).toFixed(2) : 0,
              totalEarnedItems: items[index].length,
            }
            : null;
        })
          .filter(guild => guild !== null) as GuildInfo[];
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  protected readonly formatDateFromTimestamp = formatDateFromTimestamp;
}
