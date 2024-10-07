import {Component} from '@angular/core';
import {Router} from '@angular/router';

import { tap } from 'rxjs/operators';
import { ProfileService } from '../../shared/services/profile/profile.service';
import { IProfile } from '../../shared/interfaces/profile.interface';


@Component({
  selector: 'app-indicadores-auth-redirect',
  standalone: false,
  templateUrl: './auth-redirect.component.html',
})
export class AuthRedirectComponent {
  constructor(
    private _router: Router,
    private _profileService: ProfileService
  ) {
    const tokenQueryParamMap =
      this._router.getCurrentNavigation()?.initialUrl.queryParamMap;

    if (tokenQueryParamMap?.has('token')) {
      sessionStorage.setItem(
        'token',
        atob(tokenQueryParamMap.get('token') as string)
      );
    }

    this._profileService
      .getUserInfo()
      .pipe(
        tap((response: IProfile) => {
          const indicadoresToken = response.token;

          sessionStorage.setItem('token', indicadoresToken);
        }),
        tap((response: IProfile) => {
          const userProfile = {
            name: response.name,
            email: response.email,
            role: response.role,
          };

          sessionStorage.setItem('user-profile', JSON.stringify(userProfile));
          this._router.navigate(['home']);
        }),
      )
      .subscribe();
  }
}
