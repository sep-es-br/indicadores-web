import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { AreaComponent } from "./pages/area/area.component";
import { AboutComponent } from "./pages/about/about.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { ChallengeComponent } from "./pages/challenge/challenge.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthRedirectComponent } from "./pages/auth-redirect/auth-redirect.component";
import { authGuard } from "./shared/guards/auth.guard";

export const routes: Routes = [

	{
		path: "login",
		component: LoginComponent,
	},
	{
		path: "token",
		component: AuthRedirectComponent,
	},
	{
		path: "home",
		component: HomeComponent,
    	canActivate: [authGuard],
	},
	{
		path:"about",
		component: AboutComponent
	},
	{
		path: "challenge",
		component: ChallengeComponent,
		canActivate: [authGuard],	
	},
	{
		path: "area",
		component: AreaComponent,
		canActivate: [authGuard],	
	},
	{
		path: "contato",
		component: ContactComponent,	
	},
	{
		path: "**",
		redirectTo: "login",
		pathMatch: "full"
	}
];