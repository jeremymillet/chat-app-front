
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient!: Client;
  private isConnected: boolean = false;
  private connectionPromise: Promise<void>;
  private messageSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null); // Stocke les messages reçus
  private subscriptions: { [key: string]: StompSubscription } = {};

  private socketUrl = 'http://localhost:8080/auth/ws';

  constructor() {
    this.connectionPromise = new Promise((resolve) => {
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(this.socketUrl),
        debug: (str) => console.log(str),
        onConnect: () => {
          console.log('Connexion WebSocket établie.');
          this.isConnected = true;
          resolve(); // Résout la promesse une fois connecté
        },
        onDisconnect: () => {
          console.log('Déconnexion WebSocket.');
          this.isConnected = false;
        },
      });

      this.stompClient.activate(); // Démarre la connexion WebSocket
    });
  }

  // Attend la connexion WebSocket avant d'exécuter une action
  private async ensureConnection(): Promise<void> {
    if (!this.isConnected) {
      console.log('Attente de la connexion WebSocket...');
      await this.connectionPromise; // Attend la résolution de la promesse
    }
  }
  private async checkAndReconnect(): Promise<void> {
    if (!this.isConnected) {
      this.connectionPromise = new Promise((resolve) => {
        this.stompClient = new Client({
          webSocketFactory: () => new SockJS(this.socketUrl),
          debug: (str) => console.log(str),
          onConnect: () => {
            console.log('Connexion WebSocket rétablie.');
            this.isConnected = true;
            resolve(); // Résout la promesse une fois connecté
          },
          onDisconnect: () => {
            console.log('Déconnexion WebSocket.');
            this.isConnected = false;
          },
        });

        this.stompClient.activate(); // Démarre la connexion WebSocket
      });

      await this.connectionPromise;
    }
  }
  // S'abonner à une conversation
  async subscribeToConversation(conversationId: number): Promise<void> {
    const destination = `/queue/messages/${String(conversationId)}`;
    console.log(`Tentative d'abonnement à : ${destination}`);

    // Vérifie et rétablit la connexion si nécessaire
    await this.checkAndReconnect();

    const subscription = this.stompClient.subscribe(destination, (message: Message) => {
      console.log('Message reçu sur /queue/messages :', message.body);
      const receivedMessage = JSON.parse(message.body);
      this.onMessageReceived(receivedMessage); // Traite le message et émet l'événement
    });

    // Stocke l'abonnement
    this.subscriptions[destination] = subscription;

    console.log(`Abonnement réussi à : ${destination}`);
  }
  unsubscribeFromConversation(conversationId: number): void {
    const destination = `/queue/messages/${conversationId}`;
    console.log(`Tentative de désabonnement de : ${destination}`);
    if (this.subscriptions[destination]) {
      this.subscriptions[destination].unsubscribe();
      delete this.subscriptions[destination];
      console.log(`Désabonnement réussi de : ${destination}`);
    } else {
      console.log(`Aucune souscription trouvée pour : ${destination}`);
    }
  }

  // Gestion des messages reçus
  private onMessageReceived(message: any) {
    console.log('Message traité :', message);
    this.messageSubject.next(message); // Émet le message via BehaviorSubject
  }

  // Retourner un Observable pour s'abonner aux messages
  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  // Se déconnecter du WebSocket
  disconnect() {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
      console.log('WebSocket déconnecté.');
    }
  }
}
