import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Conversation } from "../types/types";
import { catchError, finalize, Observable, throwError } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class conversationsService { 
    constructor(private http: HttpClient) { }
    
    getConversation(friendshipId: number,token: string):Observable<Conversation> {
        return this.http.get<Conversation>(`http://localhost:8080/conversation/${friendshipId}`, {
                headers: {
                    'Authorization': 'Bearer ' +token,
                    'Content-Type': 'application/json'
            },
            }).pipe(
                catchError((error: HttpErrorResponse) => {
                  console.error('Erreur lors de la connexion', error.error);
                  return throwError(() => new Error(error.message)); 
                }),
            );
    }
}