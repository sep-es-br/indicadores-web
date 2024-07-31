import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-breadcrumb",
	templateUrl: "./breadcrumb.component.html",
	styleUrls: ["./breadcrumb.component.scss"]
})
export class BreadcrumbComponent implements OnInit {

	@Input() public breadcrumb: any = [];
	

	constructor(private _router: Router ,private _route: ActivatedRoute) {
		
	}

	ngOnInit(): void {
		// console.log("Breadcrumb: ", this.route.url, " - ", this.route.url.toString());
	}

}