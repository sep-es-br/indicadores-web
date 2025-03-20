import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AreaService } from "../../shared/services/area/area.service";
import { IArea, IAreaOverview } from '../../shared/interfaces/area.interface';
import { orderArrayText } from "../../shared/utils/textUtils";
import { IBreadcrumbItem } from "../../shared/interfaces/breadcrumb-item.interface";
import { ChallengeComponent } from "../challenge/challenge.component";
import { IChallenge } from "../../shared/interfaces/challenge.interface";
import { IYearTargetResult } from "../../shared/interfaces/TargetResult.interface";
import { tap } from "rxjs";
import { IOdsCount } from "../../shared/interfaces/odsCount.interface";

@Component({
	selector: "app-area",
	templateUrl: "./area.component.html",
	styleUrls: ["./area.component.scss"]
})
export class AreaComponent implements OnInit {

	public areaId: string | null = null;

	public breadcrumb: Array<IBreadcrumbItem> = [];

	public areaData!: IArea;

	public areaName!: {name: string, namePlural: string};

	public allAreas!: { [key: string]: IAreaOverview[] };

	public odsCounts!: IOdsCount[];

	public firstYear: Array<string> = []
	public secondYear: Array<string> = []
	public thirdYear: Array<string> = []
	public fourthYear: Array<string> = []

	public countFirstYear!: {green: number, yellow: number, red: number, gray: number}; 
	public countSecondYear!: {green: number, yellow: number, red: number, gray: number}; 
	public countThirdYear!: {green: number, yellow: number, red: number, gray: number}; 
	public countFourthYear!: {green: number, yellow: number, red: number, gray: number}; 

	private currentUrl: string = "";

	public currentYear: number = new Date().getFullYear();

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		public _areaService: AreaService,
	) {
	}

	ngOnInit(): void {
		this._route.queryParams.subscribe(params => {
			this.areaId = params["id"] ? String(params["id"]) : null;
			this.getData();
		});
		this.currentUrl = this._router.url;
	}

	getData(): void {
		if (this.areaId == null) {
			this._router.navigate(["/home"]);
			return;
		}
		this.getDetails();
		this.getAllAreas();
	}

	getAllAreas() {
		const allAreaResponse = this._areaService.getAll(this.areaId);
		allAreaResponse.subscribe(
			data => {
				this.allAreas = data
			}
		);
	}

	getOrganizersKey() {
		const organizersKey = Object.keys(this.allAreas || {});
    	return organizersKey.sort();
    }

	getDetails() {
		if(this.areaId){
			const areaDetail = this._areaService.getDetail(this.areaId);
			areaDetail.subscribe(
				data => {
					this.areaData = data;
					this.firstYear = this._areaService.firstYear
					this.secondYear = this._areaService.secondYear
					this.thirdYear = this._areaService.thirdYear
					this.fourthYear = this._areaService.fourthYear

					this.countFirstYear = this.countTotal(this.firstYear);
					this.countSecondYear = this.countTotal(this.secondYear);
					this.countThirdYear = this.countTotal(this.thirdYear);
					this.countFourthYear = this.countTotal(this.fourthYear);

					this.odsCounts = this.getOdsCounts();

					sessionStorage.setItem("AreaData", JSON.stringify(this.areaData))
					this.updateBreadcrumb();
				}
			);
		}
	}

	replaceIcon(newIconClass: string) {
		const iconElement = document.getElementById("iconElement");

		if (iconElement) {
			iconElement.remove();

			const newIconElement = document.createElement("i");
			newIconElement.id = "iconElement";
			newIconElement.className = `fa-solid ${newIconClass}`;

			const iconArea = document.querySelector(".iconArea");
			if(iconArea){
				iconArea.appendChild(newIconElement);
			}
		}
	}

	public countTotal(ballList: Array<string>){
		type ColorKey = 'green' | 'yellow' | 'red' | 'gray';
		let count: { green: number; red: number; yellow: number; gray: number } = { green: 0, red: 0, yellow: 0, gray: 0};
		ballList.forEach((classBall) =>{
			const colorKey = classBall.split('-')[1] as ColorKey;
			count[colorKey]++
		})
		return count
	}

	updateBreadcrumb() {
		this.breadcrumb = [
			{
				label: this.areaData.administrationName,
				link: '/home'
			}
		];
	}

	trackByChallengeId(index: number, challenge: IChallenge): string {
		return challenge.uuId;
	}

	public getOdsCounts(): IOdsCount[] {
		const odsMap: { [key: number]: number } = {};
	
		this.areaData.challenge.forEach(challenge => {
		  challenge.indicatorList.forEach(indicator => {
			indicator.ods.forEach(ods => {
			  if (odsMap[ods]) {
				odsMap[ods] += 1;
			  } else {
				odsMap[ods] = 1;
			  }
			});
		  });
		});
	
		return Object.keys(odsMap).map(key => ({
		  ods: +key,
		  count: odsMap[+key]
		}));
	  }
}