import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
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

}