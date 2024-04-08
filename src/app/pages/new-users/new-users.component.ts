import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { SubgraphService } from '../../services/subgraph.service';
import { DestroyService } from '../../services/destroy.service';
import { HeroAction, UserEntity } from '../../../../generated/gql';
import { takeUntil } from 'rxjs';
import { formatUnits, parseUnits } from 'ethers';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewUsersComponent implements OnInit {

  options: EChartsOption = {};
  isLoading = false;

  constructor(
    private destroy$: DestroyService,
    private subgraphService: SubgraphService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(() => {
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  private prepareData(): void {
    this.isLoading = true;

    this.subgraphService.fetchAllUsers$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        if (users) {
          this.prepareChartData(users as UserEntity[]);
        }
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }


  private prepareChartData(data: UserEntity[]) {

    const convertToDateString = (timestamp: string): string => {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().split('T')[0];
    };

    const userByDates: Record<string, UserEntity[]> = {};
    const pawnshopOpenActionsByDates: Record<string, number[]> = {};
    const pawnshopExecuteActionsByDates: Record<string, number[]> = {};
    const dauByDates: Record<string, Record<string, string>> = {};
    const reinforcementByDates: Record<string, number[]> = {};
    const dateCounts = data.reduce((acc, data) => {
      const dateString = convertToDateString(data.timestamp + '');
      acc[dateString] = (acc[dateString] || 0) + 1;
      if (userByDates[dateString]) {
        userByDates[dateString].push(data);
      } else {
        userByDates[dateString] = []
        userByDates[dateString].push(data);
      }

      // pawnshop actions
      data.pawnshopActions.forEach(action => {
        const datePawnshopAction = convertToDateString(action.timestamp + '');
        // create empty array for users
        if (!userByDates[datePawnshopAction]) {
          userByDates[datePawnshopAction] = []
        }

        if (action.action == 0) {
          if (pawnshopOpenActionsByDates[datePawnshopAction]) {
            pawnshopOpenActionsByDates[datePawnshopAction].push(action.action);
          } else {
            pawnshopOpenActionsByDates[datePawnshopAction] = [];
            pawnshopOpenActionsByDates[datePawnshopAction].push(action.action);
          }
        }

        if (action.action == 4) {
          if (pawnshopExecuteActionsByDates[datePawnshopAction]) {
            pawnshopExecuteActionsByDates[datePawnshopAction].push(action.action);
          } else {
            pawnshopExecuteActionsByDates[datePawnshopAction] = [];
            pawnshopExecuteActionsByDates[datePawnshopAction].push(action.action);
          }
        }
      });

      let actions: HeroAction[] = [];
      data.heroes.forEach(hero => {

        // reinforcement
        hero.earnedTokens.forEach(token => {
          if (token.reinforcementStakedFee > 0) {
            const date = convertToDateString(token.timestamp + '');

            // create empty array for users
            if (!userByDates[date]) {
              userByDates[date] = []
            }

            if (reinforcementByDates[date]) {
              reinforcementByDates[date].push(token.reinforcementStakedFee / 100 * +formatUnits(token.amount));
            } else {
              reinforcementByDates[date] = [];
              reinforcementByDates[date].push(token.reinforcementStakedFee / 100 * +formatUnits(token.amount));
            }
          }
        })

        actions.push(...hero.actions);
      });

      actions.flat().forEach(action => {
        const date = convertToDateString(action.timestamp + '');
        // create empty array for users
        if (!userByDates[date]) {
          userByDates[date] = []
        }

        // DAU
        if (dauByDates[date]) {
          dauByDates[date][data.id] = data.id;
        } else {
          dauByDates[date] = {};
          dauByDates[date][data.id] = data.id;
        }
      });

      return acc;
    }, {} as Record<string, number>);

    const dates = Object.keys(dateCounts).sort();
    const counts = dates.map(date => dateCounts[date]);

    // by refCode
    let series: SeriesOption[] = [];
    let countsRef: number[] = [];
    let pawnshopExecuteActions: number[] = [];
    let pawnshopOpenActions: number[] = [];
    let dau: number[] = [];
    let reinforcement: number[] = [];
    Object.keys(userByDates).map(date => {
      const count = userByDates[date].filter(user => {
        if (user.heroes.filter(hero => hero.refCode !== null).length > 0) {
          return true;
        }
        return false;
      }).length;

      const reinforcementArray = reinforcementByDates[date];


      countsRef.push(count);
      pawnshopExecuteActions.push(pawnshopExecuteActionsByDates[date] ? pawnshopExecuteActionsByDates[date].length : 0);
      pawnshopOpenActions.push(pawnshopOpenActionsByDates[date] ? pawnshopOpenActionsByDates[date].length : 0);
      dau.push(Object.values(dauByDates[date]).length);
      reinforcement.push(
        reinforcementArray && reinforcementArray.length > 0 ?
          +(reinforcementArray.reduce((acc, val) => acc + val, 0) / reinforcementArray.length).toFixed(2) :
        0
      );

    });

    series.push(
      {
        name: 'User created by ref code',
        type: 'line',
        data: countsRef
      }
    );
    series.push(
      {
        name: 'Market Deals',
        type: 'line',
        data: pawnshopExecuteActions
      }
    );
    series.push(
      {
        name: 'NFTs for Sale',
        type: 'line',
        data: pawnshopOpenActions
      }
    );

    series.push(
      {
        name: 'DAU',
        type: 'line',
        data: dau
      }
    );

    series.push(
      {
        name: 'Av Reinforcement Revenue',
        type: 'line',
        data: reinforcement
      }
    );

    series.push(
      {
        name: 'New users',
        type: 'line',
        data: counts,
        emphasis: {
          focus: 'series',
        },
        animationDelay: idx => idx * 10,
      }
    )

    this.options = {
      legend: {
        data: ['New users', 'User created by ref code', 'Market Deals', 'DAU', 'NFTs for Sale', 'Av Reinforcement Revenue'],
        align: 'left',
      },
      dataZoom: [
        {
          type: 'slider',
        },
        {
          type: 'inside',
        },
      ],
      grid: {
        left: 100,
        top: 50,
        right: 50,
        bottom: 80,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
            backgroundColor: '#505765',
          },
        },
      },
      xAxis: {
        data: dates,
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: false },
      },
      yAxis: {
        minInterval: 1
      },
      series: series,
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }
}
