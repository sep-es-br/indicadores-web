import { Component } from "@angular/core";

@Component({
	selector: "app-footer",
	templateUrl: "./footer.component.html",
	styleUrls: ["./footer.component.scss"]
})
export class FooterComponent {
	// Your code here
	public dateSite!:string;

	constructor(){
		this.dateSite = "2016 - " + new Date().getFullYear();
	}
}