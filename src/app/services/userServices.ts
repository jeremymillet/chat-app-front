import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { EditProfilePictureRequest, User, UserProfileEditRequest } from "../types/types";
import { AuthService } from "./authServices";

@Injectable({
    providedIn: 'root',
})

export class UserService {
  

    constructor(private http: HttpClient,private authService : AuthService) { }

    editUserProfile(data: UserProfileEditRequest,token:string): Observable<User> {
        const requestFn = () =>
            this.http.patch<User>(`http://localhost:8080/users/${data.id}`, data, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
        return this.authService.retryWithToken(requestFn)
    }

    editProfilePicture(userId: number, formData: FormData, token: string): Observable<User> { 
        const requestFn = () => {
            return this.http.post<User>(`http://localhost:8080/images/upload/${userId}`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            }) 
        }
        return this.authService.retryWithToken(requestFn);
    }
}