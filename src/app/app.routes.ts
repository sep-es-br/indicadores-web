import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { AreaComponent } from "./pages/area/area.component";
import { AboutComponent } from "./pages/about/about.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { ChallengeComponent } from "./pages/challenge/challenge.component";

export const routes: Routes = [

	{
		path: "",
		component: HomeComponent,
	},
	{
		path:"about",
		component: AboutComponent
	},
	{
		path: "challenge",
		component: ChallengeComponent,	
	},
	{
		path: "area",
		component: AreaComponent,	
	},
	{
		path: "contato",
		component: ContactComponent,	
	},
	{
		path: "**",
		redirectTo: "",
		pathMatch: "full"
	}
];
