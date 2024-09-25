import { Component, numberAttribute, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from '../../shared/services/area/area.service';
import { IArea, IAreaData } from '../../shared/interfaces/area.interface';
import { ChallengeService } from '../../shared/services/challenge/challenge.service';
import { IChallenge } from '../../shared/interfaces/challenge.interface';
import { IndicatorService } from '../../shared/services/indicator/indicator.service';
import { Iindicator } from '../../shared/interfaces/indicator.interface';
import { IYearTargetResult } from '../../shared/interfaces/TargetResult.interface';
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

  public countlastYear?: {
    green?: number;
    yellow?: number;
    red?: number;
    gray?: number;
  };

  public ballClassLastYear?: string | null = null;

  public indicatorBaseYearTargetResult?: IYearTargetResult;

  public indicatorLastYearTargetResult?: IYearTargetResult;

  public challengeData?: IChallenge;

  public dropdownOpen: boolean = false;

  public dropdownOpenYear: boolean = false;

  public selectedIndicator: Iindicator | null = null;

  public selectedYearTargetResult: IYearTargetResult | null = null;

  public currentYear: number = new Date().getFullYear();

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _indicatorService: IndicatorService,
    private _challengeService: ChallengeService
  ) {
    const storedData = sessionStorage.getItem('AreaData');
    if (storedData) {
      this.areaData = JSON.parse(storedData) as IArea;
    }
  }
  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this.challengeId = params['id'] ? String(params['id']) : null;
      this.areaId = this.areaData.id;
      this.selectedIndicator = null;
      this.selectedYearTargetResult = null;
      this.countlastYear = undefined;
      this.getData();
    });
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
        this.challengeId
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
      });
    }
  }

  upYearBreadcrumb() {
    this.breadcrumb = [
      {
        label: this.areaData.name,
        link: this._router.url.split('/')[0] + '/area',
        params: {
          id: this.areaId,
        },
      },
      {
        label: this.areaData.name,
      },
    ];
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.dropdownOpenYear = false;
  }

  toggleDropdownYear() {
    this.dropdownOpenYear = !this.dropdownOpenYear;
    this.dropdownOpen = false;
  }

  selectIndicator(indicator: Iindicator) {
    this.selectedIndicator = indicator;
    this.dropdownOpen = false;
    const allYears = Array.from(
      new Set([
        ...this.selectedIndicator.resultedIn.map((item) => item.year),
        ...this.selectedIndicator.targetFor.map((item) => item.year),
      ])
    )
      .filter(
        (year) =>
          year >= this.areaData.startOfAdministrationYear &&
          year <= this.areaData.endOfAdministrationYear && 
          year !== this.currentYear - 1
      )
      .sort((a, b) => b - a);

    const yearGroupedData: IYearTargetResult[] = allYears.map((year) => {
      return {
        year,
        resultedIn: indicator.resultedIn
          .filter((item) => item.year === year)
          .map(({ year, ...rest }) => rest),
        targetFor: indicator.targetFor
          .filter((item) => item.year === year)
          .map(({ year, ...rest }) => rest),
      };
    });
    if (yearGroupedData.length > 0) {
      this.indicatorYearTargetResult = yearGroupedData;
      this.selectedYearTargetResult = this.indicatorYearTargetResult[0];
    }
    const lastYearData: IYearTargetResult = {
      year: this.currentYear - 1,
      resultedIn: indicator.resultedIn
        .filter((item) => item.year === this.currentYear - 1)
        .map(({ year, ...rest }) => rest),
      targetFor: indicator.targetFor
        .filter((item) => item.year === this.currentYear - 1)
        .map(({ year, ...rest }) => rest),
    };
    if (
      lastYearData.resultedIn.length > 0 ||
      lastYearData.targetFor.length > 0
    ) {
      this.indicatorLastYearTargetResult = lastYearData;
      this.ballClassLastYear = this.getBallClass(this.selectedIndicator.polarity, 
        this.indicatorLastYearTargetResult?.targetFor?.[0]?.value ?? 0, this.indicatorLastYearTargetResult?.resultedIn?.[0]?.value ?? 0)
      this.countlastYear = { [this.ballClassLastYear.split('-')[1]]: 1}
      
    }

    const baseYearData: IYearTargetResult = {
      year: this.areaData.startOfAdministrationYear - 1,
      resultedIn: indicator.resultedIn
        .filter(
          (item) => item.year === this.areaData.startOfAdministrationYear - 1
        )
        .map(({ year, ...rest }) => rest),
      targetFor: indicator.targetFor
        .filter(
          (item) => item.year === this.areaData.startOfAdministrationYear - 1
        )
        .map(({ year, ...rest }) => rest),
    };
    if (baseYearData.resultedIn.length > 0) {
      this.indicatorBaseYearTargetResult = baseYearData;
    }
  }

  selectYear(indicator: IYearTargetResult) {
    this.selectedYearTargetResult = indicator;
    this.dropdownOpenYear = false;
  }

  public getBallClass(
    polarity: string,
    targetFor: number,
    resultedIn: number
  ): string {
    if (!targetFor || !resultedIn || targetFor <= 0 || resultedIn <= 0) {
      return 'mirrored-gray-ball-img';
    }

    let percentage: number;

    if (polarity === 'Positiva' || polarity === 'Positivo') {
      percentage = (resultedIn / targetFor) * 100;
    } else {
      percentage = (targetFor / resultedIn) * 100;
    }

    if (percentage >= 100) {
      return 'mirrored-green-ball-img';
    } else if (percentage >= 85 && percentage < 100) {
      return 'mirrored-yellow-ball-img';
    } else if (percentage < 85) {
      return 'mirrored-red-ball-img';
    }
    return 'mirrored-gray-ball-img';
  }
}
