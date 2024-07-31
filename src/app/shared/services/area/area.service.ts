import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { IArea, IAreaOverview } from "../../interfaces/area.interface";

@Injectable({
	providedIn: "root",
})
export class AreaService {

	private _url = `${environment.apiUrl}area`;

	constructor(
		private _http: HttpClient,
	) {}

	getDetail(areaId: number): Observable<IArea> {
		return this._http.get<IArea>(`${this._url}/detail/${areaId}`).pipe(
			catchError((err: HttpErrorResponse) => {
				// this._errorHandlerService.handleError(err);
				return throwError(() => err);
			}));
	}

	getAll(): Observable<IAreaOverview[]>{
		return this._http.get<IAreaOverview[]>(this._url).pipe(
			catchError((err: HttpErrorResponse) => {
				return throwError(() => err);
			})
		);
	}
}