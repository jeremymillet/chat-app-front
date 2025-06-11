import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, map, Observable, switchMap, throwError } from 'rxjs';
import { LoginResponse, LoginResquest, SignUpRequest, User} from '../types/types';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private accesstokenSubject = new BehaviorSubject<string | null>(null);
  public accessToken$ = this.accesstokenSubject.asObservable();

  private isLoadingSignUpSubject = new BehaviorSubject<boolean>(false);
  private errorSignUpSubject = new BehaviorSubject<string | null>(null);

  isLoadingSignUp$ = this.isLoadingSignUpSubject.asObservable();
  errorSignUp$ = this.errorSignUpSubject.asObservable();

  private isLoadingLoginSubject = new BehaviorSubject<boolean>(false);
  private errorLoginSubject = new BehaviorSubject<string | null>(null);

  isLoadingLogin$ = this.isLoadingLoginSubject.asObservable();
  errorLogin$ = this.errorLoginSubject.asObservable();

  constructor(private http: HttpClient) {}

  postLogin(data: LoginResquest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://localhost:8080/auth/login', data, {
    withCredentials: true
  }).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Erreur lors de la connexion', error.error); 
      return throwError(() => new Error(error.message)); 
    }),
  );
  }
  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://localhost:8080/auth/refresh', {}, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors du renouvellement du token', error.error);
        return throwError(() => new Error('Échec du renouvellement du token'));
      })
    );
  }
  postSignUp(data: SignUpRequest): Observable<String> {
  this.isLoadingSignUpSubject.next(true); 
  this.errorSignUpSubject.next(null); 

  return this.http.post<String>('http://localhost:8080/auth/register', data).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error("Erreur lors de l'inscription", error.error); //
      this.errorSignUpSubject.next(error.error || 'Une erreur est survenue'); 
      return throwError(() => new Error(error.message)); 
    }),
    
    finalize(() => {
      this.isLoadingSignUpSubject.next(false); 
    })
  );
  }

  retryWithToken<T>(requestFn: () => Observable<T>): Observable<T> {
  return requestFn().pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) { // Erreur d'autorisation
        return this.refreshToken().pipe(
          switchMap((LoginResponse) => {
            // Mettez à jour le token dans votre état global ou service
            this.accesstokenSubject.next(LoginResponse.accessToken);
            // Relancez la requête avec le nouveau token
            return requestFn();
          }),
          catchError((refreshError) => {
            console.error('Erreur après tentative de renouvellement du token', refreshError);
            return throwError(() => new Error('Impossible de renouveler le token ou d’exécuter la requête'));
          })
        );
      }
      return throwError(() => error); // Autres erreurs
    })
  );
}

  setAccessToken(token: string) {
    this.accesstokenSubject.next(token);
    localStorage.setItem('accessToken',token);
  }

  clearAccessToken() {
    localStorage.removeItem('accessToken');
    this.accesstokenSubject.next("");
  }
  setUser(user: User): void {
    this.userSubject.next(user);
  }
  deleteCookie(cookieName: string) {
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  }

  getUser(): User | null {
    return this.userSubject.value;
  }
}