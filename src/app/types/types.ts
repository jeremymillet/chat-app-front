export interface User{
    id: number;
    username: string;
    email: string;
}

export interface Friends{
    friendshipId: number;
    friendId: number;
    friendName:string;
}

export interface Conversation { 
    conversationId: number;
    frienshipId: number;
}
export interface Message { 
    id: number;
    conversationId: number;
    senderId: number;
    content: string;
    timestamp: Date;
    isRead: boolean;
}

export interface CreateMessageRequest{
    senderId: number;
    content: string;
    conversationId: number;
}

export interface LoginResquest{
    email: string;
    password: string;
}

export interface LoginResponse{
    accessToken: string;
    user:User;
}

export interface SignUpRequest{
    username: string;
    password: string;
    email: string;
}


