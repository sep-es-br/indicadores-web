import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../shared/services/home/home.service";
import { IHome,HomeData } from "../../shared/interfaces/home.interface";
import { Observable, timeout } from "rxjs";
import { Router } from "@angular/router";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

    public currentYear: number = new Date().getFullYear();

	constructor(private router: Router) { 
	}

	ngOnInit(): void {
	}

    login(){
        this.router.navigate(['/home']);
    }
}