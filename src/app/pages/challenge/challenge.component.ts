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

  public countScoreYear?: {
    green?: number;
    yellow?: number;
    red?: number;
    gray?: number;
  };

  public ballClassCurrentYear ?: string | null = null;

  public ballClassYearTargetResult?: string | null = null;

  public indicatorBaseYearTargetResult?: IYearTargetResult;

  public indicatorFirstYearTargetResult?: IYearTargetResult;

  public challengeData?: IChallenge;

  public dropdownOpen: boolean = false;

  public showCurrentYear : boolean = false;

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
    private _challengeService: ChallengeService
  ) {
    const storedData = sessionStorage.getItem('AreaData');
    if (storedData) {
      this.areaData = JSON.parse(storedData) as IArea;
    for (let year = this.areaData.startOfAdministrationYear; year <= this.areaData.endOfAdministrationYear; year++) {
      this.allYears.push(year);
    }
    if( this.allYears.includes(this.currentYear)){
      this.selectedYear = this.currentYear;
    }else{
      this.selectedYear = this.areaData.endOfAdministrationYear;
    }
    }
  }
  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this.challengeId = params['id'] ? String(params['id']) : null;
      this.areaId = this.areaData.id;
      this.clear()
      this.getData();
    });
  }

  clear(){
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

        const yearsWithValues: number[] = [];
        const yearRange = [];
        for (let year = this.areaData.startOfAdministrationYear; year <= this.areaData.endOfAdministrationYear; year++) {
          yearRange.push(year);
        }

        yearRange.forEach((year) => {
          const hasValue = this.indicatorData.some((indicator) => 
            indicator.targetFor.some((target) => target.year === year && target.value !== null) ||
            indicator.resulted.some((result) => result.year === year && result.value !== null)
          );
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

  upYearBreadcrumb() {
    this.breadcrumb = [
      {
				label: this.areaData.administrationName,
				link: '/home'
			},
      {
        label: this.areaData.name,
        link: this._router.url.split('/')[0] + '/area',
        params: {
          id: this.areaId,
        },
      }
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
    this.dropdownOpenYearOfTitle = false
  }

  toggleDropdownYear() {
    this.dropdownOpenYear = !this.dropdownOpenYear;
    this.dropdownOpen = false;
    this.dropdownOpenYearOfTitle = false
  }

  toggleDropdownYearOfTitle(){
    this.dropdownOpenYearOfTitle = !this.dropdownOpenYearOfTitle;
    this.dropdownOpen = false;
    this.dropdownOpenYear = false;
  }

  populateCountScoreYear(year : number){
    this.selectedYear = year
    this.countScoreYear = { green: 0, yellow: 0, red: 0, gray: 0 }; 
    this.indicatorData.forEach(indicator =>{
      const resultForYear = indicator.resulted.find(result => result.year === this.selectedYear);
      const targetForYear = indicator.targetFor.find(target => target.year === this.selectedYear);


      const resultValue = resultForYear?.value; 
      const targetValue = targetForYear?.value; 

      const ballClassYearTargetResult = this.getBallClass(indicator.polarity, targetValue, resultValue);

      if (!this.countScoreYear) {
        this.countScoreYear = { green: 0, yellow: 0, red: 0, gray: 0 }; 
      }
      
      type BallClass = 'green' | 'yellow' | 'red' | 'gray';
      const key: BallClass = ballClassYearTargetResult.split('-')[1] as BallClass;
        
      if (this.countScoreYear[key]) {
        this.countScoreYear[key]! += 1; 
      } else {
        this.countScoreYear[key] = 1; 
      }
    })
  }

  selectIndicator(indicator: Iindicator) {
    this.clear()
    if (!this.selectedIndicator) {
      this.selectedIndicator = { ...indicator }; // Cria uma cópia se for a primeira vez
    } else {
      Object.assign(this.selectedIndicator, indicator); // Atualiza propriedades
    }
    this.dropdownOpen = false;
    console.log(this.selectedIndicator)
    
    const yearGroupedData: IYearTargetResult[] = this.allYears.map((year) => {
      return {
        year,
        resultedIn: indicator.resulted
          .filter((item) => item.year === year)
          .map(({ year, ...rest }) => rest),
        targetFor: indicator.targetFor
          .filter((item) => item.year === year)
          .map(({ year, ...rest }) => rest),
      };
    });
      this.indicatorYearTargetResult = yearGroupedData;
      this.selectedYearTargetResult = this.indicatorYearTargetResult.find(
          (item) => item.year === this.selectedYear) ?? null;

      this.ballClassYearTargetResult = this.getBallClass(this.selectedIndicator.polarity, 
      this.selectedYearTargetResult?.targetFor?.[0]?.value, this.selectedYearTargetResult?.resultedIn?.[0]?.value)

    // if(this.currentYear >= this.areaData.startOfAdministrationYear && this.currentYear <= this.areaData.endOfAdministrationYear){
      const firstYearData: IYearTargetResult = {
        year: this.areaData.startOfAdministrationYear,
        resultedIn: indicator.resulted
          .filter((item) => item.year === this.areaData.startOfAdministrationYear)
          .map(({ year, ...rest }) => rest),
        targetFor: indicator.targetFor
          .filter((item) => item.year === this.areaData.startOfAdministrationYear)
          .map(({ year, ...rest }) => rest),
      };

        this.indicatorFirstYearTargetResult = firstYearData;
        this.ballClassCurrentYear  = this.getBallClass(
          this.selectedIndicator.polarity, 
          this.indicatorFirstYearTargetResult?.targetFor?.[0]?.value,
          this.indicatorFirstYearTargetResult?.resultedIn?.[0]?.value
        )


    const baseYearData: IYearTargetResult = {
      year: this.areaData.startOfAdministrationYear - 1,
      resultedIn: indicator.resulted
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
    }else{
      this.indicatorBaseYearTargetResult = undefined
    }

    if(this.indicatorFirstYearTargetResult == undefined && !(this.selectedYearTargetResult == null)){
      this.showCurrentYear  = false
    }else{
      this.showCurrentYear  = true
    }
  }



  selectYearOfTitle(year: number){
    this.populateCountScoreYear(year)
    
    if(this.selectedIndicator){
      this.selectedYearTargetResult = this.indicatorYearTargetResult.find(
          (item) => item.year === this.selectedYear) ?? null;
      this.ballClassYearTargetResult = this.getBallClass(this.selectedIndicator.polarity, 
      this.selectedYearTargetResult?.targetFor?.[0]?.value , this.selectedYearTargetResult?.resultedIn?.[0]?.value)
      

    }
    this.dropdownOpenYearOfTitle = false;
  }

  selectYear(indicator: IYearTargetResult) {
    this.selectedYearTargetResult = indicator;
    this.selectedYear = indicator.year ?? null;
    if (this.selectedYear !== null) {
      this.populateCountScoreYear(this.selectedYear);
    }
    if(this.selectedIndicator){
      this.ballClassYearTargetResult = this.getBallClass(this.selectedIndicator.polarity, 
      this.selectedYearTargetResult?.targetFor?.[0]?.value , this.selectedYearTargetResult?.resultedIn?.[0]?.value )
    }

    this.dropdownOpenYear = false;
  }

  public getBallClass(
    polarity: string,
    targetFor?: number,
    resultedIn?: number
  ): string {
    if (targetFor === null || targetFor === undefined || resultedIn === null || resultedIn === undefined) {
      return 'mirrored-gray-ball-img';
    }
    let value: number;
  
    if (targetFor === 0) {
      value = -resultedIn;
    } else {
      value = (targetFor - resultedIn) / Math.abs(targetFor);
    }
  
    const finalPercentage = (polarity === 'Positiva' || polarity === 'Positivo')
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
      }
    });
  }
  
}
