import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, tap, throwError } from "rxjs";
import { IArea, IAreaOverview } from "../../interfaces/area.interface";
import { IChallenge } from "../../interfaces/challenge.interface";
import { IYearTargetResult } from "../../interfaces/TargetResult.interface";
import { Iindicator } from "../../interfaces/indicator.interface";
import { ErrorHandlerService } from "../error-handler/error-handler.service";

@Injectable({
	providedIn: "root",
})
export class AreaService {

	private _url = `${environment.apiUrl}area`;

	private currentYear: number = new Date().getFullYear();

	public administrationYear: number = 0;

	public lastYearClassMap: Array<string> = []

	public secondToLastYearClassMap: Array<string> = []

	constructor(
		private _http: HttpClient,
		private _errorHandlerService: ErrorHandlerService,
	) {}

	getDetail(areaId: String): Observable<IArea> {
		return this._http.get<IArea>(`${this._url}/detail/${areaId}`).pipe(
			tap((area)=> {
				if(this.currentYear -1 >= area.startOfAdministrationYear && this.currentYear -1 <= area.endOfAdministrationYear){
					this.lastYearClassMap = area.challenge.map((challenge)=> this.getBallClass(challenge, this.currentYear  -1))
					this.secondToLastYearClassMap = area.challenge.map((challenge)=> this.getBallClass(challenge, this.currentYear  -2))
					this.administrationYear = this.currentYear  -1
				}else{
					this.lastYearClassMap = area.challenge.map((challenge)=> this.getBallClass(challenge, area.endOfAdministrationYear))
					this.secondToLastYearClassMap = area.challenge.map((challenge)=> this.getBallClass(challenge, area.endOfAdministrationYear -1))
					this.administrationYear = area.endOfAdministrationYear
				}
			}),
			catchError((err: HttpErrorResponse) => {
				this._errorHandlerService.handleError(err);
				return throwError(() => err);
			}));
	}

	getAll(areaId: String | null): Observable<IAreaOverview[]>{
		return this._http.get<IAreaOverview[]>(`${this._url}/${areaId}`).pipe(
			catchError((err: HttpErrorResponse) => {
				this._errorHandlerService.handleError(err);
				return throwError(() => err);
			})
		);
	}

	private getBallClass(challenge: IChallenge, referringYear: number) : string{

		let indicatorScoreCalculationResultList: number[] = [];

		challenge.indicatorList.forEach((indicator) => {

			const yearGroupedData: IYearTargetResult = {
				year: referringYear,
				resultedIn: indicator.resultedIn
					.filter(item => item.year === referringYear)
					.map(({ year, ...rest }) => rest),  
				targetFor: indicator.targetFor
					.filter(item => item.year === referringYear)
					.map(({ year, ...rest }) => rest)  
			};

			const targetFor: number = yearGroupedData.targetFor[0]?.value
			const resultedIn: number =  yearGroupedData.resultedIn[0]?.value
			const result = this.getIndicatorScoreCalculationResult(indicator.polarity, targetFor, resultedIn);

			if (result !== null && result !== undefined) {
				indicatorScoreCalculationResultList.push(result);
			}
			});

			const total = indicatorScoreCalculationResultList.reduce((acc, curr) => acc + curr, 0);
    		const average = indicatorScoreCalculationResultList.length > 0 ? total / indicatorScoreCalculationResultList.length : -1;

			if (average == -1){
				return 'mirrored-gray-ball-img'
			}else if (average >= 7.5) {
				return 'mirrored-green-ball-img'
			} else if (average >= 5 && average < 7.5) {
				return 'mirrored-yellow-ball-img';
			} else {
				return 'mirrored-red-ball-img';
			}

	}

	private getIndicatorScoreCalculationResult(polarity: string, targetFor: number, resultedIn: number): number | null {
		if (!targetFor || !resultedIn || targetFor <= 0 || resultedIn <= 0) {
		  return null;
		}
	  
		let percentage: number;
	  
		if (polarity === 'Positiva' || polarity === 'Positivo') {
		  percentage = (resultedIn / targetFor) * 100;
		} else {
		  percentage = (targetFor / resultedIn) * 100;
		}
	  
		if (percentage >= 100) {
		  return 10;
		} else if (percentage >= 85 && percentage < 100) {
		  return 5;
		} else if (percentage < 85) {
		  return 0;
		}

		return null;
	  }
}