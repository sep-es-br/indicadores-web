import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { AreaComponent } from "./area/area.component";
import { AboutComponent } from "./about/about.component";
import { ComponentsModule } from "../components/components.module";
import { ContactComponent } from "./contact/contact.component";
import { CountUpModule } from "ngx-countup";
import { RouterModule } from "@angular/router";

@NgModule({
	declarations: [
		HomeComponent,
		AreaComponent,
		AboutComponent,
		ContactComponent
	],
	exports: [
		HomeComponent,
		AreaComponent,
		AboutComponent,
		ContactComponent
	],
	imports: [
		CommonModule,
		ComponentsModule,
		CountUpModule,
		RouterModule
	]
})
export class PagesModule { }