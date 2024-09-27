import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable, catchError, throwError } from "rxjs";
import { IHome } from "../../interfaces/home.interface";
import { IAdministration } from "../../interfaces/administration.interface";

@Injectable({
	providedIn: "root",
})
export class HomeService {

	private _url = `${environment.apiUrl}home-info`;

	constructor(
		private _http: HttpClient,
		// private _errorHandlerService: ErrorHandlerService
	) {}

	getGeneralData(administrationId: string): Observable<IHome> {
		return this._http.get<IHome>(`${this._url}/general/${administrationId}`).pipe(
			catchError((err: HttpErrorResponse) => {
				// this._errorHandlerService.handleError(err);
				return throwError(() => err);
			}));
	}

	administrationList():  Observable<IAdministration[]>{
		return this._http.get<IAdministration[]>(`${this._url}/administrations`).pipe(
			catchError((err: HttpErrorResponse) => {
				// this._errorHandlerService.handleError(err);
				return throwError(() => err);
			}));
	}


}