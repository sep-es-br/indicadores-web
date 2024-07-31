import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { NgbDropdownModule, NgbToastModule, NgbModule, NgbTooltipModule, NgbAlertModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";

@NgModule({
	declarations: [
		FooterComponent,
		HeaderComponent,
		BreadcrumbComponent,
	],
	imports: [
		CommonModule,
		RouterModule ,
		NgbDropdownModule,
		NgbToastModule,
		NgbModule,
		NgbTooltipModule,
		NgbAlertModule
		// CollapseModule.forRoot(),
		// NavbarModule.forRoot()
	],
	exports: [
		FooterComponent,
		HeaderComponent,
		BreadcrumbComponent
	]
})
export class ComponentsModule { }