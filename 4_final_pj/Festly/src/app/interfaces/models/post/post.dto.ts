import { Timestamp } from "@angular/fire/firestore";

export interface PostDTO {
    id: string;
    title: string;
    likes: number;
    eventName: string;
    createdAt: Timestamp;
    author: string;
    imageUrl: string | null;
}