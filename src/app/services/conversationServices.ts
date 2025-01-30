import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Conversation } from "../types/types";
import { catchError, finalize, Observable, throwError } from "rxjs";
import { AuthService } from "./authServices";

@Injectable({
    providedIn: 'root',
})
export class conversationsService { 
    constructor(private http: HttpClient,private authService: AuthService) { }
    
    getConversation(friendshipId: number, token: string): Observable<Conversation> {
    const requestFn = () =>
        this.http.get<Conversation>(`http://localhost:8080/conversation/${friendshipId}`, {
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });

    return this.authService.retryWithToken(requestFn);
}
}