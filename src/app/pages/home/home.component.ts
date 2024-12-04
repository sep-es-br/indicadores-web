import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../shared/services/home/home.service";
import { IHome, HomeData, OverViewOrganizer } from '../../shared/interfaces/home.interface';
import { Observable, timeout } from "rxjs";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

	public homeData!:IHome;
	public administrationId!:string;
	public areaName!:string;
	public overViewOrganizer!:  {name: string; nameInPlural:string; count: number}[]


	constructor(private _homeService: HomeService) { 
		this.homeData = new HomeData();
	}

	ngOnInit(): void {
	}

	getData(){
		const responseData = this._homeService.getGeneralData(this.administrationId);
		responseData.subscribe(
			data=> {
				this.homeData = data;
				this.overViewOrganizer = this.getOverviewList()
				if(this.homeData.overview.organizer.childOrganizer.length == 0){
					this.areaName = this.homeData.overview.organizer.parentOrganizer[0]?.nameInPlural
				}else{
					this.areaName = this.homeData.overview.organizer.childOrganizer[0]?.nameInPlural
				}}
		);
	}

	onDropdownChange(event: string){
		this.administrationId = event
		if (this.administrationId) {
			this.getData();
		}
	}

	getOrganizersKey() {
		const organizersKey = Object.keys(this.homeData.organizers || {});
    	return organizersKey.sort();
    }

	getOverviewList(){
		const overviewList = [];

		this.homeData.overview.organizer.parentOrganizer.forEach(item => {
			overviewList.push({
			  name: item.name,
			  nameInPlural: item.nameInPlural,
			  count: item.countOrganizer,
			});
		  });
	  
		  this.homeData.overview.organizer.childOrganizer.forEach(item => {
			overviewList.push({
				name: item.name,
				nameInPlural: item.nameInPlural,
				count: item.countOrganizer,
			});
		  });
	  
		  overviewList.push({
			name: 'Desafio',
			nameInPlural: 'Desafios',
			count: this.homeData.overview.desafios
		  });
	  
		  overviewList.push({
			name: 'Indicador',
			nameInPlural: 'Indicadores',
			count: this.homeData.overview.indicadores
		  });
	  
		  return overviewList;
		}

}