import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.scss"]
})
export class AboutComponent implements OnInit {

	public breadcrumb:any = [];
	areaId: any;
	currentUrl: any;


	constructor(private _router: Router ,private _route: ActivatedRoute) { 
		this.breadcrumb = [
			{
				label: "Sobre",
			}
		];
	}

	ngOnInit(): void {
		
	}

}