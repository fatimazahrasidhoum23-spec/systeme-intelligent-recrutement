import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Intercepteur HTTP :
 *  1. Ajoute le JWT Bearer si présent dans localStorage
 *     (backend a UseAuthentication mais aucun [Authorize] → optionnel pour l'instant)
 *  2. Loggue les erreurs réseau / 4xx / 5xx
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 0:
          console.error('[Network] Backend inaccessible. Vérifiez : dotnet run sur port 5292.');
          break;
        case 400:
          console.error('[400 Bad Request]', error.error?.erreur ?? error.message);
          break;
        case 401:
          console.error('[401] Token invalide ou expiré.');
          break;
        case 500:
          console.error('[500] Erreur serveur.', error.message);
          break;
        default:
          console.error(`[HTTP ${error.status}]`, error.message);
      }
      return throwError(() => error);
    })
  );
};
