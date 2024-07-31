import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../shared/services/home/home.service";
import { IHome,HomeData } from "../../shared/interfaces/home.interface";
import { Observable } from "rxjs";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

	public title = "indicadores";
	public homeData!:IHome;


	constructor(private _homeService: HomeService) { 
		this.homeData = new HomeData();
		console.log(this.homeData);
	}

	ngOnInit(): void {
		this.getData();
	}

	getData(){
		const responseData = this._homeService.getGeneralData();
		responseData.subscribe(
			data=> {
				this.homeData = data;
				console.log("Dados backend -->",data);}
		);
	}

}