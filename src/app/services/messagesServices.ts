import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { Message, postMessage } from "../types/types";
import { AuthService } from "./authServices";

@Injectable({
    providedIn: 'root',
})
export class messagesService { 
    
    constructor(private http: HttpClient,private authService : AuthService) { }
    
    getMessages(conversationId: number, token: string): Observable<Message[]> {
    const requestFn = () =>
        this.http.get<Message[]>(`http://localhost:8080/messages/${conversationId}`, {
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
        });

        return this.authService.retryWithToken(requestFn);
    }
    postMessages(token: string, message: postMessage): Observable<string> {
    const requestFn = () =>
        this.http.post<string>(`http://localhost:8080/messages/send`, message, {
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        responseType: 'text' as 'json'
        });

    return this.authService.retryWithToken(requestFn);
    }
}