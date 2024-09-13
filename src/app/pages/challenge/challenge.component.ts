import { Component, numberAttribute, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AreaService } from "../../shared/services/area/area.service";
import { IArea, IAreaData } from "../../shared/interfaces/area.interface";
import { ChallengeService } from "../../shared/services/challenge/challenge.service";
import { IChallenge } from "../../shared/interfaces/challenge.interface";
import { IndicatorService } from "../../shared/services/indicator/indicator.service";
import { Iindicator } from "../../shared/interfaces/indicator.interface";

@Component({
	selector: "app-challenge",
	templateUrl: "./challenge.component.html",
	styleUrls: ["./challenge.component.scss"]
})
export class ChallengeComponent implements OnInit{
	
	public breadcrumb: unknown = [];

	public areaId: string | null = null;

	public challengeId: string | null = null;

	public areaData!: IArea;

	public indicatorData: Iindicator[] = [];

	public indicatorDate: number[] = [2021,2022,2017,2018,2019,2020];

	public challengeData!: IChallenge;

	public dropdownOpen: boolean = false;
	public dropdownOpenDate: boolean = false;

	public selectedIndicator: Iindicator | null = null;

	public selectedDate: number | null = null;

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _indicatorService: IndicatorService,
		private _challengeService: ChallengeService
	) {
		const storedData = sessionStorage.getItem("AreaData");
		if (storedData) {
			this.areaData = JSON.parse(storedData) as IArea;
		}
	}
	ngOnInit(): void {
		this._route.queryParams.subscribe(params => {
			this.challengeId = params["id"] ? String(params["id"]) : null;
			this.areaId = this.areaData.id;
			this.getData();
		});
	}

	getData(): void {
		if (this.areaId == null) {
			this._router.navigate(["/"]);
			return;
		}
		this.getDetails();
	}

	getDetails() {
		const challengeDatail = this._challengeService.getDetail(Number(this.challengeId))
		challengeDatail.subscribe(
			data => {
				this.challengeData = data;
				this.updateBreadcrumb();
			}
		);
		const indicatorDetail = this._indicatorService.getDetail(Number(this.challengeId))
		indicatorDetail.subscribe(
			data => {
				this.indicatorData = data;
				const odsArray = [1,2,3,15]
				this.indicatorData.forEach(indicator => {
					indicator.ods = odsArray;
				});
			}
		)
	}

	updateBreadcrumb() {
		this.breadcrumb = [
			{
				label: this.areaData.name,
				link: this._router.url.split("/")[0]+"/area",
				params: {
					id: this.areaId
				}
			},
			{
				label: this.areaData.name
			}
		];
	}

	toggleDropdown() {
		this.dropdownOpen = !this.dropdownOpen;
		this.dropdownOpenDate = false
	}

	toggleDropdownDate() {
		this.dropdownOpenDate = !this.dropdownOpenDate;
		this.dropdownOpen = false
	}

	selectIndicator(indicator: Iindicator) {
		this.selectedIndicator = indicator;
		this.dropdownOpen = false;
	}

	selectDate(date: number){
		this.selectedDate = date
		this.dropdownOpenDate = false
	}
}