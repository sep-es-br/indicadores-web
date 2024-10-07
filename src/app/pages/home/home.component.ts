import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../shared/services/home/home.service";
import { IHome,HomeData } from "../../shared/interfaces/home.interface";
import { Observable, timeout } from "rxjs";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

	public title = "indicadores";
	public homeData!:IHome;
	public administrationId!:string;


	constructor(private _homeService: HomeService) { 
		this.homeData = new HomeData();
	}

	ngOnInit(): void {
	}

	getData(){
		const responseData = this._homeService.getGeneralData(this.administrationId);
		responseData.subscribe(
			data=> {
				this.homeData = data;}
		);
	}

	onDropdownChange(event: string){
		this.administrationId = event
		if (this.administrationId) {
			this.getData();
		}
	}

}