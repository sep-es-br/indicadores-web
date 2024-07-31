import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-contact",
	templateUrl: "./contact.component.html",
	styleUrls: ["./contact.component.scss"]
})
export class ContactComponent implements OnInit {
	breadcrumb: { label: string; }[];

	constructor() { 
		this.breadcrumb = [
			{
				label: "Sobre",
			}
		];
	}

	ngOnInit(): void {
		// Initialization logic goes here
	}

}