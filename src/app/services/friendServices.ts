import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, combineLatest, finalize, map, Observable, throwError } from "rxjs";
import { Friend } from "../types/types";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class friendService{
    private isLoadingFriendsSubject = new BehaviorSubject<boolean>(false);
    private errorFriendsSubject = new BehaviorSubject<string | null>(null);
    private friendsSubject = new BehaviorSubject<Friend[] | null>(null);
  
    
    private isLoadingFriendsRequestSubject = new BehaviorSubject<boolean>(false);
    private errorFriendsRequestSubject = new BehaviorSubject<string | null>(null);
  
    private isLoadingFriendsRequestAccepteSubject = new BehaviorSubject<boolean>(false);
    private errorFriendsRequestAccepteSubject = new BehaviorSubject<string | null>(null);
  
    private searchTermSubject = new BehaviorSubject<string>('');
    private filterTypeSubject = new BehaviorSubject<'all' | 'pending'>('all');
  
    isLoadingFriends$ = this.isLoadingFriendsSubject.asObservable();
    errorFriends$ = this.errorFriendsSubject.asObservable();
    friends$ = this.friendsSubject.asObservable();
  
    searchTerm$ = this.searchTermSubject.asObservable();
    filterType$ = this.filterTypeSubject.asObservable();

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

  acceptFriendRequest(userId:number, friendId:number, token: string): Observable<any> {
    this.isLoadingFriendsRequestAccepteSubject.next(true);
    this.errorFriendsRequestAccepteSubject.next(null);
    return this.http.post<any>("http://localhost:8080/friends/accept-request", null,{
      headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
      params: new HttpParams().set('friendId', String(friendId)).set('userId', userId)
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Erreur lors de la requete d'acceptation", error.error);
        this.errorFriendsRequestAccepteSubject.next(error.error || 'Une erreur est survenue'); 
        return throwError(() => new Error(error.message)); 
      }),
      finalize(() => {
        this.isLoadingFriendsRequestAccepteSubject.next(false); 
      })
    )

  }

  public filteredFriends$: Observable<Friend[]> = combineLatest([
    this.friends$,
    this.searchTerm$,
    this.filterType$,
  ]).pipe(
    map(([friends, searchTerm, filterType]) => {
      if (!friends) return [];

      // Appliquer le filtre de recherche
      let filteredFriends = friends;
      if (searchTerm) {
        filteredFriends = filteredFriends.filter(friend =>
          friend.friendName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Appliquer le filtre "pending" ou "all"
      if (filterType === 'pending') {
        filteredFriends = filteredFriends.filter(friend => !friend.isAccepted);
      }

      return filteredFriends;
    })
  );
  setFriends(friends: Friend[]): void {
    this.friendsSubject.next(friends);
  }
  setSearchTerm(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm);
  }

  setFilterType(filterType: 'all' | 'pending'): void {
    this.filterTypeSubject.next(filterType);
  }
}
    



