import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ItemEntity, ItemMetaEntity, PawnshopPositionEntity } from '../../../../generated/gql';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { getChainId } from '../../shared/constants/network.constant';
import { takeUntil } from 'rxjs';
import { EChartsOption } from 'echarts';
import { getItemNameBySymbol } from '../../shared/constants/game.constant';

@Component({
  selector: 'app-pawnshop-price-range',
  templateUrl: './pawnshop-price-range.component.html',
  styleUrls: ['./pawnshop-price-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PawnshopPriceRangeComponent implements OnInit {

  options: EChartsOption = {};

  isLoading = false;
  network: string = '';
  chainId: number = 0;
  itemArray: Array<{ label: string; value: string }> = [];
  selectedItem?: string;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
  ) { }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(network => {
      this.network = network;
      this.chainId = getChainId(network);
      this.isLoading = true;
      this.subgraphService.fetchAllItemsMeta$(this.destroy$)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(data => {
          if (data) {
            this.itemArray = (data as ItemMetaEntity[]).map(item => {
              return { label: getItemNameBySymbol(item.name), value: item.id + '' };
            });
          }
          this.prepareData();
          this.changeDetectorRef.detectChanges();
        });
    });
  }

  prepareData(): void {
    if (!this.selectedItem && this.itemArray.length > 0) {
      this.selectedItem = this.itemArray[0].value;
    }

    if (this.selectedItem) {
      this.isLoading = true;
      this.subgraphService.fetchAllPawnshopOpenPositions$(this.selectedItem, this.destroy$)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(data => {
          if (data) {
            const rangePrice = this.groupByRange(data as PawnshopPositionEntity[]);


            const values: any[] = Object.values(rangePrice);
            values.unshift(null)

            this.options = {
              legend: {
                data: ['Prices'],
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
                data: ['', ...Object.keys(rangePrice)],
                type: 'category',
                boundaryGap: false,
                axisLine: { onZero: false },
              },
              yAxis: {
                minInterval: 1
              },
              series: [
                {
                  name: 'Prices',
                  type: 'bar',
                  data: values,
                }
              ],
              animationEasing: 'elasticOut',
              animationDelayUpdate: idx => idx * 5,
            };
          }
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        });
    }
  }

  groupByRange(data: PawnshopPositionEntity[]): Record<number, number> {
    const result: Record<number, number> = {};
    data.forEach(item => {
      const acquiredAmount = parseInt(item.acquiredAmount, 10);
      const range = Math.floor(acquiredAmount / 10) * 10;
      if (result[range]) {
        result[range] += 1;
      } else {
        result[range] = 1;
      }
    });
    return result;
  }

  selectItem(item: string): void {
    this.selectedItem = item;
    this.prepareData();
  }

}
