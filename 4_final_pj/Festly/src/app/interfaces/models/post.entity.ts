import { Timestamp } from "@angular/fire/firestore";

export interface PostEntity {
    id: number;
    title: string;
    likes: number;
    eventName: string;
    createdAt: Timestamp;
    author: string;
}