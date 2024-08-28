import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AreaService } from "../../shared/services/area/area.service";
import { IArea, IAreaData } from "../../shared/interfaces/area.interface";
import { ChallengeService } from "../../shared/services/challenge/challenge.service";
import { IChallenge } from "../../shared/interfaces/challenge.interface";

@Component({
	selector: "app-challenge",
	templateUrl: "./challenge.component.html",
	styleUrls: ["./challenge.component.scss"]
})
export class ChallengeComponent implements OnInit{
	
	public breadcrumb: unknown = [];

	public areaId: number | null = null;

	public challengeId: number | null = null;

	public areaData!: IArea;

	public challengeData!: IChallenge;

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _areaService: AreaService,
		private _challengeService: ChallengeService
	) {
		const storedData = sessionStorage.getItem("AreaData");
		if (storedData) {
			this.areaData = JSON.parse(storedData) as IArea;
		}
	}
	ngOnInit(): void {
		this._route.queryParams.subscribe(params => {
			this.challengeId = params["id"] ? Number(params["id"]) : null;
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
		const areaDetail = this._areaService.getDetail(Number(this.areaId));
		areaDetail.subscribe(
			data => {
				this.areaData = data;
			}
		);
		challengeDatail.subscribe(
			data => {
				this.challengeData = data;
				this.updateBreadcrumb();
			}
		);
		
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
}