import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { IChallenge } from "../../interfaces/challenge.interface";
import { ErrorHandlerService } from "../error-handler/error-handler.service";

@Injectable({
	providedIn: "root",
})
export class ChallengeService {

	private _url = `${environment.apiUrl}challenge`;

	constructor(
        private _http: HttpClient,
		private _errorHandlerService: ErrorHandlerService,
	) { }

	getDetail(challengeId: string): Observable<IChallenge> {
		return this._http.get<IChallenge>(`${this._url}/detail/${challengeId}`).pipe(
			catchError((err: HttpErrorResponse) => {
				this._errorHandlerService.handleError(err);
				return throwError(() => err);
			}));
	}
}