import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../shared/services/home/home.service";
import { IHome,HomeData } from "../../shared/interfaces/home.interface";
import { Observable, timeout } from "rxjs";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../shared/services/autentication/authentication.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

    public currentYear: number = new Date().getFullYear();

	constructor(private authenticationService: AuthenticationService) { 
	}

	ngOnInit(): void {
	}

    login(){
        this.authenticationService.acessoCidadaoSignIn();
    }
}