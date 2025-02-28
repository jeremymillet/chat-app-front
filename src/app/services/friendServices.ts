import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, combineLatest, finalize, map, Observable, throwError } from "rxjs";
import { Friend } from "../types/types";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { AuthService } from "./authServices";

@Injectable({
  providedIn: 'root',
})
export class friendService{
  private isLoadingFriendsSubject = new BehaviorSubject<boolean>(false);
  private errorFriendsSubject = new BehaviorSubject<string | null>(null);
  private friendsSubject = new BehaviorSubject<Friend[] | null>(null);

  isLoadingFriends$ = this.isLoadingFriendsSubject.asObservable();
  errorFriends$ = this.errorFriendsSubject.asObservable();
  friends$ = this.friendsSubject.asObservable();

  
  private isLoadingFriendsRequestSubject = new BehaviorSubject<boolean>(false);
  private errorFriendsRequestSubject = new BehaviorSubject<string | null>(null);
  
  isLoadingFriendsRequest$ = this.isLoadingFriendsRequestSubject.asObservable();
  errorFriendsRequest$ = this.errorFriendsRequestSubject.asObservable();

  
  private isLoadingFriendsRequestAccepteSubject = new BehaviorSubject<boolean>(false);
  private errorFriendsRequestAccepteSubject = new BehaviorSubject<string | null>(null);

  isLoadingFriendsRequestAccepte$ = this.isLoadingFriendsRequestAccepteSubject.asObservable()
  errorFriendsRequestAccepte$ = this.errorFriendsRequestAccepteSubject.asObservable();


  private isLoadingDeleteFriendsSubject = new BehaviorSubject<boolean>(false);
  private errorDeleteFriendsSubject = new BehaviorSubject<string | null>(null);

  isLoadingDeleteFriends$ = this.isLoadingDeleteFriendsSubject.asObservable();
  errorDeleteFriends$ = this.errorDeleteFriendsSubject.asObservable();


  private searchTermSubject = new BehaviorSubject<string>('');
  private filterTypeSubject = new BehaviorSubject<'all' | 'pending'>('all');

  searchTerm$ = this.searchTermSubject.asObservable();
  filterType$ = this.filterTypeSubject.asObservable();
  

  constructor(private http: HttpClient, private authService: AuthService) { 
  }
  
  getFriends(userId: number, token: string): Observable<Friend[]> {
    const requestFn = () => this.http.get<Friend[]>(`http://localhost:8080/friends/${userId}/friends`, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    return this.authService.retryWithToken(requestFn).pipe(
      finalize(() => {
        this.isLoadingFriendsSubject.next(false);
      })
    );
  }
  getFriend(userId: number, friendshipId: number, token: string): Observable<Friend> {
  const requestFn = () =>
    this.http.get<Friend>(`http://localhost:8080/friends/${userId}/friend/${friendshipId}`, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

  return this.authService.retryWithToken(requestFn);
}
  
  addFriend(userId: number, friendId: number, token: string): Observable<any> {
    const requestFn = () =>
      this.http.post<any>("http://localhost:8080/friends/send-request", null, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        params: new HttpParams()
          .set('friendId', String(friendId))
          .set('userId', String(userId)),
      });

    return this.authService.retryWithToken(requestFn).pipe(
      finalize(() => {
        this.isLoadingFriendsRequestSubject.next(false);
      })
    );
  }

  acceptFriendRequest(userId: number, friendId: number, token: string): Observable<any> {
    const requestFn = () =>
      this.http.post<any>("http://localhost:8080/friends/accept-request", null, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        params: new HttpParams()
          .set('friendId', String(friendId))
          .set('userId', String(userId)),
      });

    return this.authService.retryWithToken(requestFn).pipe(
      finalize(() => {
        this.isLoadingFriendsRequestAccepteSubject.next(false);
      })
    );
  }

  deleteFriend(friendshipId: number, token: string): Observable<any> {
    const requestFn = () =>
      this.http.delete<any>("http://localhost:8080/friends/delete", {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        params: new HttpParams().set('friendShipId', String(friendshipId)),
      });

    return this.authService.retryWithToken(requestFn).pipe(
      finalize(() => {
        this.isLoadingDeleteFriendsSubject.next(false);
      })
    );
  }

  getFriendsWithConversations(userId: number, token: string): Observable<Friend[]> {
    const requestFn = () =>
      this.http.get<Friend[]>(`http://localhost:8080/friends/${userId}/friendsWithConversations`, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        params: new HttpParams().set('userId', String(userId)),
      });

    return this.authService.retryWithToken(requestFn);
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
    



