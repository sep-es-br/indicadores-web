import { Component, OnInit } from "@angular/core";
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

	public areaId: number | null = null;

	public breadcrumb:unknown = [];

	public areaData!: IArea;

	public allAreas!:IAreaOverview[];

	private challenges!:any;

	private currentUrl:string = "";

	constructor(private _router: Router ,private _route: ActivatedRoute, private _areaService: AreaService) {
		this.areaId = this._route.snapshot.queryParams["id"] ?? null;
		this.currentUrl = this._router.url;
	}

	ngOnInit(): void {
		this.getData();
	}

	getData(): void {
		if (this.areaId == null) {
			this._router.navigate(["/"]);
		}

		this.getAllAreas();
		this.getDetails();

	}

	getAllAreas(){
		const allAreaResponse = this._areaService.getAll();
		allAreaResponse.subscribe(
			data => {
				this.allAreas = orderArrayText(data,"name");
				console.log("Todas as Áreas --> ",data);
			}
		);
	}

	getDetails(){
		const areaDetail =  this._areaService.getDetail(Number(this.areaId));
		console.log(areaDetail);
		areaDetail.subscribe(
			data => {
				console.log("Dados backend -->",typeof data);
				this.areaData = data;
				this.updateBreadcrumb();
			}
		);
	}

	updateBreadcrumb(){
		this.breadcrumb = [
			{
				label: this.areaData.name,
				link: this._router.navigateByUrl(this.currentUrl),
				params: {
					id: this.areaId
				}
			}
		];
	}

}