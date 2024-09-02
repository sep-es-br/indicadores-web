import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Iindicator } from "../../interfaces/indicator.interface";

@Injectable({
	providedIn: "root",
})
export class IndicatorService {

	private _url = `${environment.apiUrl}indicator`;

	constructor(
        private _http: HttpClient,
	) { }

	getDetail(challengeId: number): Observable<Iindicator[]> {
		return this._http.get<Iindicator[]>(`${this._url}/detail/${challengeId}`).pipe(
			catchError((err: HttpErrorResponse) => {
				return throwError(() => err);
			}));
	}
}