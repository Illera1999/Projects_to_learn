import { Timestamp } from "@angular/fire/firestore";
import { MusicGenre } from "./event-genre";

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
    genre: MusicGenre;
}