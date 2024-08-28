import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { DefaultTitleStrategy, TitleStrategy, provideRouter, withRouterConfig } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes, withRouterConfig({ onSameUrlNavigation: "reload" })),
		provideAnimations(),
		{ provide: TitleStrategy, useClass: DefaultTitleStrategy },
		importProvidersFrom(HttpClientModule)
	]
};
