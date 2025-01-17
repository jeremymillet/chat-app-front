import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { Message } from "../types/types";

@Injectable({
    providedIn: 'root',
})
export class conversationsService { 
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
}