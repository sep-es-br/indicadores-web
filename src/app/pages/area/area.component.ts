import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AreaService } from "../../shared/services/area/area.service";
import { IArea, IAreaOverview } from "../../shared/interfaces/area.interface";
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

	public allAreas!: IAreaOverview[];

	public odsCounts!: IOdsCount[];

	public countlastYear!: {green: number, yellow: number, red: number, grey: number}; 

	public countSecondToLast!: {green: number, yellow: number, red: number, grey: number}; 

	public lastYearClassMap: Array<string> = []

	public secondToLastYearClassMap: Array<string> = []

	private currentUrl: string = "";

	public currentYear: number = new Date().getFullYear();

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _areaService: AreaService,
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
			this._router.navigate(["/"]);
			return;
		}
		this.getAllAreas();
		this.getDetails();
	}

	getAllAreas() {
		const allAreaResponse = this._areaService.getAll();
		allAreaResponse.subscribe(
			data => {
				this.allAreas = orderArrayText(data, "name");
				console.log("Todas as Áreas --> ", data);
			}
		);
	}

	getDetails() {
		if(this.areaId){
			const areaDetail = this._areaService.getDetail(this.areaId);
			console.log(areaDetail);
			areaDetail.subscribe(
				data => {
					console.log("Dados backend -->", data);
					this.areaData = data;
					this.lastYearClassMap = this._areaService.lastYearClassMap
					this.secondToLastYearClassMap = this._areaService.secondToLastYearClassMap
					this.countlastYear = this.countTotal(this.lastYearClassMap);
					this.countSecondToLast = this.countTotal(this.secondToLastYearClassMap);
					this.odsCounts = this.getOdsCounts();
					sessionStorage.setItem("AreaData",JSON.stringify(this.areaData));
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
		type ColorKey = 'green' | 'yellow' | 'red' | 'grey';
		let count: { green: number; red: number; yellow: number; grey: number } = { green: 0, red: 0, yellow: 0, grey: 0,};
		ballList.forEach((classBall) =>{
			const colorKey = classBall.split('-')[1] as ColorKey;
			count[colorKey]++
		})
		return count
	}

	updateBreadcrumb() {
		this.breadcrumb = [
			{
				label: this.areaData.name,
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