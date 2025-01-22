import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { Message, postMessage } from "../types/types";

@Injectable({
    providedIn: 'root',
})
export class messagesService { 
    
    constructor(private http: HttpClient) { }
    
    getMessages(conversationId: number,token: string):Observable<Message[]> {
        return this.http.get<Message[]>(`http://localhost:8080/messages/${conversationId}`, {
                headers: {
                    'Authorization': 'Bearer ' +token,
                    'Content-Type': 'application/json'
            },
            }).pipe(
                catchError((error: HttpErrorResponse) => {
                  console.error('Erreur lors de la recuperation des messages', error.error);
                  return throwError(() => new Error(error.message)); 
                }),
            );
    }
    postMessages(token: string,message:postMessage){
        return this.http.post<string>(`http://localhost:8080/messages/send`, message, {
            headers: {
                'Authorization': 'Bearer '+ token
            },
            responseType: 'text' as 'json',
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error("Erreur lors de l'envoie  du messages", error.error);
                return throwError(() => new Error(error.message)); 
            }),
        )
    }
}