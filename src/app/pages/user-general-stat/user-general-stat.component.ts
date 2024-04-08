import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GeneralStatInterface } from '../../models/general-stat.interface';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { forkJoin, takeUntil } from 'rxjs';
import { isTrialHero } from '../../shared/utils/hero-utils';
import { HEROES_CLASSES } from '../../shared/constants/heroes.constant';

@Component({
  selector: 'app-user-general-stat',
  templateUrl: './user-general-stat.component.html',
  styleUrls: ['./user-general-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserGeneralStatComponent implements OnInit {

  columns: string[] = ['Parameter', 'Value', 'Comment'];

  data: GeneralStatInterface[] = [];
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
    forkJoin({
      users: this.subgraphService.fetchAllUsers$(),
      heroMaxLvl: this.subgraphService.heroMaxLevel$(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ users, heroMaxLvl }) => {
        const maxSecondsLastAction = this.prepareSeconds(7);

        const maxBiome = 4;
        const mauSeconds = this.prepareSeconds(30);
        const wauSeconds = this.prepareSeconds(7);
        const dauSeconds = this.prepareSeconds(1);

        let totalUsers = users.length;
        let mau = 0;
        let wau = 0;
        let dau = 0;
        let churnRate = 0;
        let activeUser = 0;
        let totalHeroes = 0;
        let kFactor = 0;
        let maxLvl = heroMaxLvl.length > 0 ? heroMaxLvl[0].stats.level : 0;
        let medLvlRefArray: number[] = [];
        let maxEquippedHero = 0;
        let completeAdventuresChurn = 0;
        let startTrial = 0;
        let finishTrial = 0;
        let onlyTrial = 0;
        let firstBuyHero = 0;
        let incativeOneLifechanceHeroes = 0;
        let conversionToHeroAfterOnboarding = 0;
        let treasuryEligible = 0;
        let nftTraders = 0;
        let fullLifeChances = 0;

        let totalBrokenItems = 0;
        let totalRepairedAction = 0;
        let totalAugmentAction = 0;
        let inactiveAndNoItemAction = 0;

        const heroClassesCount: Record<string, number> = {};
        const heroesByLevel: Record<number, number> = {};
        const stakedHeroesByBiomeRecord: Record<string, { staked: number, total: number }> = {};

        for (const user of users) {

          let isActiveUser = false;
          let checkedActivity = false;
          const sortedHero = user.heroes.map(hero => {
            return {
              timestamp: hero.timestamp,
              class: hero.meta.heroClass
            }
          }).sort((a, b) => +a.timestamp - +b.timestamp);

          if (sortedHero.length > 0 && !isTrialHero(sortedHero[0].class)) {
            firstBuyHero++;
          }

          if (sortedHero.length > 1 && isTrialHero(sortedHero[0].class) && !isTrialHero(sortedHero[1].class)) {
            conversionToHeroAfterOnboarding++;
          }

          let hasActions = false;
          let onlyOneHero = true;

          for (const hero of user.heroes) {
            totalHeroes++;
            if (hero.refCode != null) {
              kFactor++;
              medLvlRefArray.push(hero.stats.level);
            }

            if (hero.items.length > 11) {
              maxEquippedHero++;
            }

            if (hero.actions.length > 0) {
              hasActions = true;
              if (!checkedActivity) {
                if (+hero.actions[0].timestamp > dauSeconds) {
                  dau++;
                }
                if (+hero.actions[0].timestamp > wauSeconds) {
                  wau++;
                }
                if (+hero.actions[0].timestamp > mauSeconds) {
                  mau++;
                }
                checkedActivity = true;
              }

              // check Churn Rate
              if (+hero.actions[0].timestamp > wauSeconds && !isActiveUser) {
                isActiveUser = true;
              }

              if (+hero.actions[0].timestamp < wauSeconds && hero.stats.lifeChances === 1) {
                incativeOneLifechanceHeroes++;
              }
            }

            if (hero.actions.length > 5 && +hero.actions[0].timestamp < maxSecondsLastAction && onlyOneHero) {
              completeAdventuresChurn++;
              onlyOneHero = false;
            }

            if (isTrialHero(hero.meta.heroClass)) {
              startTrial++;
              if (hero.dead) {
                finishTrial++;
              }
            }

            if (hero.stats.level >= maxLvl - 5 + maxBiome) {
              treasuryEligible++;
            }

            if (hero.stats.lifeChances > 4) {
              fullLifeChances++;
              if (!heroesByLevel[hero.stats.level]) {
                heroesByLevel[hero.stats.level] = 1;
              } else {
                heroesByLevel[hero.stats.level]++;
              }
            }

            if (!heroClassesCount[hero.meta.heroClass]) {
              heroClassesCount[hero.meta.heroClass] = 1;
            } else {
              heroClassesCount[hero.meta.heroClass]++;
            }

            if (!stakedHeroesByBiomeRecord[hero.biome]) {
              stakedHeroesByBiomeRecord[hero.biome] = { staked: 0, total: 0 };
            }

            if (hero.staked) {
              stakedHeroesByBiomeRecord[hero.biome].staked++;
            }

            stakedHeroesByBiomeRecord[hero.biome].total++;
          }

          if (user.heroes.filter(hero => isTrialHero(hero.meta.heroClass)).length > 0 && user.heroes.filter(hero => !isTrialHero(hero.meta.heroClass)).length === 0) {
            onlyTrial++;
          }

          if (isActiveUser) {
            activeUser++;
          }

          for (const item of user.items) {
            if (item.durability === 0) {
              totalBrokenItems++;
            }
            for (const action of item.actions) {
              if (action.action === 0) {
                totalRepairedAction++;
              } else if (action.action === 3) {
                totalAugmentAction++;
              }
            }
          }

          let hasItemAction = false;
          for (const itemAction of user.itemActions) {
            if (itemAction.action === 0 || itemAction.action === 3) {
              hasItemAction = true;
              break;
            }
          }

          if (!hasItemAction && !checkedActivity) {
            inactiveAndNoItemAction++;
          }

          if (hasActions && user.pawnshopActions.length > 0) {
            nftTraders++;
          }
        }

        churnRate = activeUser / users.length * 100;

        const totalHeroByBiome: GeneralStatInterface[] = [];

        const stakedHeroesByBiome = Object.keys(stakedHeroesByBiomeRecord).map(biome => {
          const value = stakedHeroesByBiomeRecord[biome].staked;
          const total = stakedHeroesByBiomeRecord[biome].total;

          totalHeroByBiome.push({
            parameter: `Total heroes by ${biome} biome`,
            value: total,
            comment: 'Total heroes'
          })

          return {
            parameter: `Staked heroes by ${biome} biome`,
            value: `${value} (${(value / total * 100).toFixed(2)}%)`,
            comment: 'Staked heroes'
          }
        });


        const medLvlRef = medLvlRefArray.length > 0 ? medLvlRefArray.reduce((a, b) => a + b) / medLvlRefArray.length : 0;

        const popularHeroes = Object.keys(heroClassesCount).map(heroClass => {
          const value = heroClassesCount[heroClass];

          return {
            parameter: `Popular Hero ${HEROES_CLASSES.get(heroClass)}`,
            value: `${(value / totalHeroes * 100).toFixed(2)}%`,
            comment: 'Popular hero (percentage by heroes)'
          }
        }, {});

        const lifeChancesByLevel = Object.keys(heroesByLevel).map(lvl => {
          const value = heroesByLevel[+lvl];

          return {
            parameter: `Full Life chances by ${lvl} level`,
            value: value,
            comment: 'Life chances'
          }
        });

        this.data.push({
          parameter: 'Unique users',
          value: totalUsers,
          comment: 'Unique users'
        });

        this.data.push({
          parameter: 'Total heroes',
          value: totalHeroes,
          comment: 'Not dead heroes'
        });

        // ACTIONS
        this.data.push({
          parameter: 'DAU',
          value: dau,
          comment: 'Actions of unique users within a 24-hour period'
        });
        this.data.push({
          parameter: 'WAU',
          value: wau,
          comment: 'Actions of unique users within a week'
        });
        this.data.push({
          parameter: 'MAU',
          value: mau,
          comment: 'Actions of unique users within a month'
        });
        this.data.push({
          parameter: 'Churn Rate',
          value: `${churnRate.toFixed(2)}%`,
          comment: '(Number of users who left / Total number of users) * 100%.'
        });
        this.data.push({
          parameter: 'Lifetime',
          value: `${(1 / ((mau - dau) / 30)).toFixed(2)}`,
          comment: '1 / ((MAU - DAU) / 30), where DAU is the average number of unique users per day, MAU is the average number of unique users per month.'
        });


        this.data.push({
          parameter: 'StickyFactor',
          value: `${(dau / mau * 100).toFixed(2)}%`,
          comment: '(DAU / MAU) * 100%, where DAU is the average number of unique users per day, MAU is the average number of unique users per month.'
        });

        // HERO
        this.data.push({
          parameter: 'Kfactor',
          value: kFactor,
          comment: 'The number of people who came through the referral code'
        });
        this.data.push({
          parameter: 'Med lvl Ref',
          value: medLvlRef.toFixed(2),
          comment: 'Median level of those invited by referral code'
        });
        this.data.push({
          parameter: 'Started Onboarding',
          value: startTrial,
          comment: 'The number of users who started a trial'
        })
        this.data.push({
          parameter: 'Ended Onboarding',
          value: finishTrial,
          comment: 'Percentage of users who completed the trial'
        });
        this.data.push({
          parameter: 'Onboarding Churn Rate',
          value: onlyTrial,
          comment: 'Users who only completed the trial'
        });
        this.data.push({
          parameter: 'Conversion to Hero',
          value: `${(firstBuyHero / totalUsers * 100).toFixed(2)}%`,
          comment: 'Percentage of users who created (purchased) a hero after their first visit'
        });
        this.data.push({
          parameter: 'Conversion to Hero after Onboarding',
          value: conversionToHeroAfterOnboarding,
          comment: 'Users who purchased their FIRST hero after completing the trial (dropped ones are not counted)'
        });

        this.data.push({
          parameter: 'Treasury Eligible',
          value: treasuryEligible,
          comment: 'The number of people with a level greater than or equal to max level - 5 + max biome'
        });

        this.data.push({
          parameter: '1 Lifechance Heroes',
          value: incativeOneLifechanceHeroes,
          comment: 'Number of heroes with 1 life chance, with no actions taken for more than x days / All heroes with 1 life chance'
        });


        this.data.push({
          parameter: 'NFT Traders',
          value: `${nftTraders} (${(nftTraders / users.length * 100).toFixed(2)}%)`,
          comment: 'Percentage of users who only use the marketplace'
        });
        this.data.push({
          parameter: 'Full Lifechances',
          value: fullLifeChances,
          comment: 'Lifechances'
        });
        this.data.push({
          parameter: 'Full Equiped',
          value: maxEquippedHero,
          comment: 'More than 11 items'
        });
        this.data.push({
          parameter: 'Med Broken Items',
          value: (totalBrokenItems / totalUsers).toFixed(1),
          comment: 'Broken items / total users'
        });
        this.data.push({
          parameter: 'Med Repairs',
          value: (totalRepairedAction / totalUsers).toFixed(1),
          comment: 'Repaired items / total users'
        });
        this.data.push({
          parameter: 'Med Augmented Items',
          value: (totalAugmentAction / totalUsers).toFixed(1),
          comment: 'Augment items / total users'
        });

        this.data.push({
          parameter: 'Inactive users (no item actions)',
          value: inactiveAndNoItemAction,
          comment: 'Active more than 7 days ago and no item actions'
        });


        this.data.push({
          parameter: 'Complete Adventures Churn',
          value: completeAdventuresChurn,
          comment: 'The number of users who stopped playing after completing more than 2 dungeons and last action more than 7 days ago'
        });



        this.data.push(...lifeChancesByLevel);

        this.data.push(...popularHeroes);
        this.data.push(...stakedHeroesByBiome);
        this.data.push(...totalHeroByBiome);

        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  prepareSeconds(days: number): number {
    const now = new Date();
    now.setDate(now.getDate() - days);
    return Math.floor(now.getTime() / 1000);
  }
}
