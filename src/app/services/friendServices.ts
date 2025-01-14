import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, finalize, Observable, throwError } from "rxjs";
import { Friend } from "../types/types";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class friendService{
    private isLoadingFriendsSubject = new BehaviorSubject<boolean>(false);
    private errorFriendsSubject = new BehaviorSubject<string | null>(null);
    private friendsSubject = new BehaviorSubject<Friend[] | null>(null);
    private filteredFriendsSubject: BehaviorSubject<Friend[]> = new BehaviorSubject<Friend[]>([]);
    private isLoadingFriendsRequestSubject = new BehaviorSubject<boolean>(false);
    private errorFriendsRequestSubject = new BehaviorSubject<string | null>(null);
  
    isLoadingFriends$ = this.isLoadingFriendsSubject.asObservable();
    errorFriends$ = this.errorFriendsSubject.asObservable();
    public friends$ = this.friendsSubject.asObservable();
    public friendsSearchFiltered$ = this.filteredFriendsSubject.asObservable();

    constructor(private http: HttpClient) { }
    
    getFriends(userId:number,token:string):Observable<Friend[]>{
        this.isLoadingFriendsSubject.next(true);
        this.errorFriendsSubject.next(null);

        return this.http.get<Friend[]>(`http://localhost:8080/friends/${userId}/friends`, {
            headers: {
                'Authorization': 'Bearer ' +token,
                'Content-Type': 'application/json'
            }
        }).pipe(
            catchError((error: HttpErrorResponse) => {
              console.error('Erreur lors de la connexion', error.error);
              this.errorFriendsSubject.next(error.error || 'Une erreur est survenue'); 
              return throwError(() => new Error(error.message)); 
            }),
            
            finalize(() => {
              this.isLoadingFriendsSubject.next(false); 
            })
        );
  }
  
  addFriend(userId: number, friendId: number, token: string): Observable<any> {
    this.isLoadingFriendsRequestSubject.next(true);
    this.errorFriendsRequestSubject.next(null);
    return this.http.post<any>("http://localhost:8080/friends/send-request",null,{
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        params: new HttpParams().set('friendId', String(friendId)).set('userId', userId)
        }).pipe(
            catchError((error: HttpErrorResponse) => {
              console.error("Erreur lors de la requete d'amis", error.error);
              this.errorFriendsRequestSubject.next(error.error || 'Une erreur est survenue'); 
              return throwError(() => new Error(error.message)); 
            }),
            finalize(() => {
              this.isLoadingFriendsRequestSubject.next(false); 
            })
        );
  }

  setFriends(friends: Friend[]): void {
      this.friendsSubject.next(friends);
      this.filteredFriendsSubject.next(friends);
  }

  filterFriends(searchTerm: string): void {
  if (!searchTerm) {
    // Si aucun terme de recherche, afficher tous les amis
    this.friendsSubject.value && this.filteredFriendsSubject.next(this.friendsSubject.value);
    return;
  }

  const filteredFriends = this.friendsSubject.value?.filter(friend =>
    friend.friendName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  this.filteredFriendsSubject.next(filteredFriends);
  }
}
    



