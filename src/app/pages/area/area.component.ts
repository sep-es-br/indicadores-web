import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AreaService } from "../../shared/services/area/area.service";
import { IArea, IAreaOverview } from "../../shared/interfaces/area.interface";
import { orderArrayText } from "../../shared/utils/textUtils";

@Component({
	selector: "app-area",
	templateUrl: "./area.component.html",
	styleUrls: ["./area.component.scss"]
})
export class AreaComponent implements OnInit {

	public areaId: String | null = null;

	public breadcrumb: unknown = [];

	public areaData!: IArea;

	public allAreas!: IAreaOverview[];

	private challenges!: any;

	private currentUrl: string = "";

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

	updateBreadcrumb() {
		this.breadcrumb = [
			{
				label: this.areaData.name,
			}
		];
	}

}