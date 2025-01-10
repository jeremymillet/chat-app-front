import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, Observable, throwError } from 'rxjs';
import { LoginResponse, LoginResquest, SignUpRequest} from '../types/types';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoadingLoginSubject = new BehaviorSubject<boolean>(false);
  private errorLoginSubject = new BehaviorSubject<string | null>(null);

  isLoadingLogin$ = this.isLoadingLoginSubject.asObservable();
  errorLogin$ = this.errorLoginSubject.asObservable();

  private isLoadingSignUpSubject = new BehaviorSubject<boolean>(false);
  private errorSignUpSubject = new BehaviorSubject<string | null>(null);

  isLoadingSignUp$ = this.isLoadingSignUpSubject.asObservable();
  errorSignUp$ = this.errorSignUpSubject.asObservable();

  constructor(private http: HttpClient) {}

  postLogin(data: LoginResquest): Observable<LoginResponse> {
  
  this.isLoadingLoginSubject.next(true);
  this.errorLoginSubject.next(null);

  return this.http.post<LoginResponse>('http://localhost:8080/auth/login', data).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Erreur lors de la connexion', error.error);
      this.errorLoginSubject.next(error.error || 'Une erreur est survenue'); 
      return throwError(() => new Error(error.message)); 
    }),
    
    finalize(() => {
      this.isLoadingLoginSubject.next(false); 
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

  setToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  clearToken() {
    localStorage.removeItem('accessToken');
  }
}