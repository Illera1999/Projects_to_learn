import { Timestamp } from "@angular/fire/firestore";

export interface EventDto {
    id: string;
    date: Timestamp;
    eventName: string;
    place:{
        city: string,
        country: string,
        lat: number,
        lng: number,
        name: string
    }
}