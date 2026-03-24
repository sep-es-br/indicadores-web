import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IArea } from '../../shared/interfaces/area.interface';
import { ChallengeService } from '../../shared/services/challenge/challenge.service';
import { IChallenge } from '../../shared/interfaces/challenge.interface';
import { IndicatorService } from '../../shared/services/indicator/indicator.service';
import { Iindicator } from '../../shared/interfaces/indicator.interface';
import {
  ITimes,
  IYearTargetResult,
} from '../../shared/interfaces/TargetResult.interface';
import { IBreadcrumbItem } from '../../shared/interfaces/breadcrumb-item.interface';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss'],
})
export class ChallengeComponent implements OnInit {
  public breadcrumb: Array<IBreadcrumbItem> = [];

  public areaId: string | null = null;

  public challengeId: string | null = null;

  public areaData!: IArea;

  public indicatorData: Iindicator[] = [];

  public indicatorYearTargetResult: IYearTargetResult[] = [];

  public countScoreYear?: {
    green?: number;
    yellow?: number;
    red?: number;
    gray?: number;
  };

  public ballClassCurrentYear?: string | null = null;

  public ballClassYearTargetResult?: string | null = null;

  public indicatorBaseYearTargetResult?: IYearTargetResult;

  public indicatorFirstYearTargetResult?: IYearTargetResult;

  public challengeData?: IChallenge;

  public dropdownOpen: boolean = false;

  public showCurrentYear: boolean = false;

  public dropdownOpenYear: boolean = false;

  public dropdownOpenYearOfTitle: boolean = false;

  public selectedIndicator: Iindicator | null = null;

  public selectedYearTargetResult: IYearTargetResult | null = null;

  public currentYear: number = new Date().getFullYear();

  public allYears: number[] = [];

  public selectedYear: number | null = null;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _indicatorService: IndicatorService,
    private _challengeService: ChallengeService,
  ) {
    const storedData = sessionStorage.getItem('AreaData');
    if (storedData) {
      this.areaData = JSON.parse(storedData) as IArea;
      for (
        let year = this.areaData.startOfAdministrationYear;
        year <= this.areaData.endOfAdministrationYear;
        year++
      ) {
        this.allYears.push(year);
      }
      if (this.allYears.includes(this.currentYear)) {
        this.selectedYear = this.currentYear;
      } else {
        this.selectedYear = this.areaData.endOfAdministrationYear;
      }
    }
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this.challengeId = params['id'] ? String(params['id']) : null;
      this.areaId = this.areaData.id;
      this.clear();
      this.getData();
    });
  }

  clear() {
    this.selectedIndicator = null;
    this.selectedYearTargetResult = null;
    this.indicatorFirstYearTargetResult = undefined;
  }

  getData(): void {
    if (this.areaId == null) {
      this._router.navigate(['/']);
      return;
    }
    this.getDetails();
  }

  getDetails() {
    if (this.challengeId) {
      const challengeDatail = this._challengeService.getDetail(
        this.challengeId,
      );
      challengeDatail.subscribe((data) => {
        this.challengeData = data;
        if (
          this.challengeData.indicatorList &&
          Array.isArray(this.challengeData.indicatorList)
        ) {
          this.indicatorData = this.challengeData.indicatorList;
        }

        this.upYearBreadcrumb();

        const yearsWithValues: number[] = [];

        const yearRange = [];
        for (
          let year = this.areaData.startOfAdministrationYear;
          year <= this.areaData.endOfAdministrationYear;
          year++
        ) {
          yearRange.push(year);
        }

        yearRange.forEach((year) => {
          const hasValue = this.indicatorData.some((indicator) => {
            const time = this.findTimeForYear(indicator.times, year);
            return time?.valueResult != null;
          });

          if (hasValue) {
            yearsWithValues.push(year);
          }
        });

        if (yearsWithValues.length > 0) {
          this.selectedYear = Math.max(...yearsWithValues);
        }

        if (this.selectedYear !== null) {
          this.populateCountScoreYear(this.selectedYear);
        }
      });
    }
  }

  verifyYearIndicator(
    itemYear: number | string,
    baseYear: number | string | undefined | null,
  ): boolean {
    if (baseYear == null) return false;
    const base = Number(baseYear);
    const item = Number(itemYear);

    // if (base.includes('-')) {
    //   const [start, end] = base.split('-').map(Number);
    //   return Number(item) >= start && Number(item) <= end;
    // }

    return item === base;
  }

  verifyTypeYear(
    itemYear: number | string,
    baseYear: number | string | undefined | null,
    type: string,
  ): boolean {
    if (baseYear == null) return false;

    return type.toUpperCase() === 'BIANUAL';
  }

  upYearBreadcrumb() {
    this.breadcrumb = [
      {
        label: this.areaData.administrationName,
        link: '/home',
      },
      {
        label: this.areaData.name,
        link: this._router.url.split('/')[0] + '/area',
        params: {
          id: this.areaId,
        },
      },
    ];
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.dropdownOpenYear = false;
    this.dropdownOpenYearOfTitle = false;
  }

  toggleDropdownYear() {
    this.dropdownOpenYear = !this.dropdownOpenYear;
    this.dropdownOpen = false;
    this.dropdownOpenYearOfTitle = false;
  }

  toggleDropdownYearOfTitle() {
    this.dropdownOpenYearOfTitle = !this.dropdownOpenYearOfTitle;
    this.dropdownOpen = false;
    this.dropdownOpenYear = false;
  }

  populateCountScoreYear(year: number) {
    this.selectedYear = year;
    this.countScoreYear = { green: 0, yellow: 0, red: 0, gray: 0 };

    this.indicatorData.forEach((indicator) => {
      const time = this.findTimeForYear(indicator.times, year);

      const ballClassYearTargetResult = this.getBallClass(
        indicator.polarity,
        time?.valueGoal,
        time?.valueResult,
      );

      if (!this.countScoreYear) {
        this.countScoreYear = { green: 0, yellow: 0, red: 0, gray: 0 };
      }

      type BallClass = 'green' | 'yellow' | 'red' | 'gray';
      const key: BallClass = ballClassYearTargetResult.split(
        '-',
      )[1] as BallClass;

      if (this.countScoreYear[key]) {
        this.countScoreYear[key]! += 1;
      } else {
        this.countScoreYear[key] = 1;
      }
    });
  }

  private findTimeForYear(
    times: ITimes[],
    year: number,
  ): Omit<ITimes, 'year'> | undefined {
    const found = times?.find((t) => {
      if (String(t.year).includes('-')) {
        const [start, end] = String(t.year).split('-').map(Number);
        return year >= start && year <= end;
      }
      return Number(t.year) === year;
    });

    if (!found) return undefined;
    const { year: _, ...rest } = found;
    return rest;
  }

  selectIndicator(indicator: Iindicator) {
    this.clear();
    if (!this.selectedIndicator) {
      this.selectedIndicator = { ...indicator };
    } else {
      Object.assign(this.selectedIndicator, indicator);
    }

    this.dropdownOpen = false;

    const yearGroupedData: IYearTargetResult[] = this.allYears.map((year) => {
      const time = this.findTimeForYear(indicator.times, year);
      return { year, times: time ? [time] : [] };
    });

    this.indicatorYearTargetResult = yearGroupedData;
    this.selectedYearTargetResult =
      this.indicatorYearTargetResult.find(
        (item) => Number(item.year) === this.selectedYear,
      ) ?? null;

    this.ballClassYearTargetResult = this.getBallClass(
      this.selectedIndicator.polarity,
      this.selectedYearTargetResult?.times?.[0]?.valueGoal,
      this.selectedYearTargetResult?.times?.[0]?.valueResult,
    );

    const firstYearTime = this.findTimeForYear(
      indicator.times,
      this.areaData.startOfAdministrationYear,
    );

    this.indicatorFirstYearTargetResult = {
      year: this.areaData.startOfAdministrationYear,
      times: firstYearTime ? [firstYearTime] : [],
    };

    this.ballClassCurrentYear = this.getBallClass(
      this.selectedIndicator.polarity,
      this.indicatorFirstYearTargetResult?.times?.[0]?.valueGoal,
      this.indicatorFirstYearTargetResult?.times?.[0]?.valueResult,
    );

    const baseYear = this.areaData.startOfAdministrationYear - 1;
    const baseYearTime = this.findTimeForYear(indicator.times, baseYear);
    this.indicatorBaseYearTargetResult = baseYearTime
      ? { year: baseYear, times: [baseYearTime] }
      : undefined;
    this.showCurrentYear = !(
      this.indicatorFirstYearTargetResult == undefined &&
      this.selectedYearTargetResult != null
    );
  }

  selectYearOfTitle(year: number) {
    this.populateCountScoreYear(year);

    if (this.selectedIndicator) {
      this.selectedYearTargetResult =
        this.indicatorYearTargetResult.find(
          (item) => Number(item.year) === this.selectedYear,
        ) ?? null;

      this.ballClassYearTargetResult = this.getBallClass(
        this.selectedIndicator.polarity,
        this.selectedYearTargetResult?.times?.[0]?.valueGoal,
        this.selectedYearTargetResult?.times?.[0]?.valueResult,
      );
    }
    this.dropdownOpenYearOfTitle = false;
  }

  selectYear(indicator: IYearTargetResult) {
    this.selectedYearTargetResult = indicator;
    this.selectedYear = indicator.year ?? null;
    if (this.selectedYear !== null) {
      this.populateCountScoreYear(this.selectedYear);
    }
    if (this.selectedIndicator) {
      this.ballClassYearTargetResult = this.getBallClass(
        this.selectedIndicator.polarity,
        this.selectedYearTargetResult?.times?.[0]?.valueGoal,
        this.selectedYearTargetResult?.times?.[0]?.valueResult,
      );
    }
    this.dropdownOpenYear = false;
  }
  public getBallClass(
    polarity: string,
    targetFor?: number,
    resultedIn?: number,
  ): string {
    if (
      targetFor === null ||
      targetFor === undefined ||
      resultedIn === null ||
      resultedIn === undefined
    ) {
      return 'mirrored-gray-ball-img';
    }
    let value: number;

    if (targetFor === 0) {
      value = -resultedIn;
    } else {
      value = (targetFor - resultedIn) / Math.abs(targetFor);
    }

    const finalPercentage =
      polarity === 'Positiva' || polarity === 'Positivo'
        ? 1 - value
        : 1 + value;

    const percentage = finalPercentage * 100;

    if (percentage >= 100) {
      return 'mirrored-green-ball-img';
    } else if (percentage >= 75 && percentage < 100) {
      return 'mirrored-yellow-ball-img';
    } else if (percentage < 75) {
      return 'mirrored-red-ball-img';
    }

    return 'mirrored-gray-ball-img';
  }

  downloadPdf(): void {
    const filename = this.selectedIndicator?.fileName;
    const originalFilename = this.selectedIndicator?.originalFileName;

    if (!filename || !originalFilename) {
      console.warn('Arquivo PDF não disponível para download.');
      return;
    }

    this._indicatorService.downloadPdf(filename, originalFilename).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = originalFilename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao fazer download do PDF:', err);
      },
    });
  }
}
