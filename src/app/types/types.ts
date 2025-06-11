export interface User{
    id: number;
    username: string;
    email: string;
    createdAt: string;
    description?: string;
    profilePicture?: string;
}
export interface UserProfileEditRequest {
    id: number;
    username?: string;
    description?: string;
}
export interface EditProfilePictureRequest{
    userId: number;
    profilePicture: File;
}

export interface Friend{
    friendshipId: number;
    friendId: number;
    requestSenderId: number;
    friendName: string;
    createdAt: string;
    isAccepted: boolean;
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
export interface postMessage{
    conversationId: number;
    senderId: number;
    content: string;
}


