import {
  CanActivateChildFn,
  Router
} from '@angular/router';
import { inject } from '@angular/core';
import { IProfile } from '../interfaces/profile.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProfileService } from '../services/profile/profile.service';
import { ToastService } from '../services/toast/toast.service';

export const authGuard: CanActivateChildFn = (route, state) => {

  const router = inject(Router);
  const profileService = inject(ProfileService);
  const toastService = inject(ToastService);
  const urlToken = route.queryParamMap.get('urlToken'); 

  if (urlToken) {
    sessionStorage.setItem('token', urlToken); 

    return profileService.getTokenInfo().pipe(
      tap((response: IProfile) => {
        
        const userProfile = {
          name: response.name,
          email: response.email,
          role: response.role,
        };
        if (!response.role.includes('INDICADORES_ADMIN')) {
          toastService.showToast('error','Acesso negado: Você não tem permissão para acessar essa aplicação');
          sessionStorage.clear(); 
          router.navigate(['/login']); 
          return; 
        }

        sessionStorage.setItem('user-profile', JSON.stringify(userProfile));
        router.navigate([state.url.split('?')[0]], {
          queryParams: {}, 
          replaceUrl: true, 
        });
      }),
      catchError(() => {
        toastService.showToast(
          'error',
          'Erro ao obter informações do usuário'
        );
        sessionStorage.clear();
        router.navigate(['/login']);
        return of(false); 
      }),
      map(() => true) 
    );
  }

  const storageToken = sessionStorage.getItem('token');
  
  if (!storageToken) {
    router.navigateByUrl('/login', {
      state: { authError: 'Você precisa estar logado para acessar essa página.' },
    });
    return false; 
  }


  return true; 
};

