

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient!: Client;
  private isConnected: boolean = false;
  private connectionPromise: Promise<void>;
  private messageSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null); // Stocke les messages reçus

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

  // S'abonner à une conversation
  async subscribeToConversation(conversationId: number): Promise<void> {
    const destination = `/queue/messages/${String(conversationId)}`;
    console.log(`Tentative d'abonnement à : ${destination}`);

    // Assure que la connexion WebSocket est établie
    await this.ensureConnection();

    this.stompClient.subscribe(destination, (message: Message) => {
        console.log('Message reçu sur /queue/messages :', message.body);
        const receivedMessage = JSON.parse(message.body)
        this.onMessageReceived(receivedMessage); // Traite le message et émet l'événement
        
    });

    console.log(`Abonnement réussi à : ${destination}`);
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
