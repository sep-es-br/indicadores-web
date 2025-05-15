import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Iindicator } from "../../interfaces/indicator.interface";
import { ErrorHandlerService } from "../error-handler/error-handler.service";

@Injectable({
	providedIn: "root",
})
export class IndicatorService {

	private _url = `${environment.apiUrl}indicator`;

	constructor(
        private _http: HttpClient,
		private _errorHandlerService: ErrorHandlerService,
	) { }

	downloadPdf(filename: string, originalFilename: string): Observable<Blob> {
		const params = new HttpParams()
		  .set('filename', filename)
		  .set('originalFilename', originalFilename);
	  
		return this._http.get(`${this._url}/download-pdf`, {
		  params,
		  responseType: 'blob',
		}).pipe(
		  catchError((error: HttpErrorResponse) => {
			this._errorHandlerService.handleError(error);
			return throwError(() => error);
		  })
		);
	  }

}