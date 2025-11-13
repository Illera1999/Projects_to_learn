export interface PostDTO {
    id: string;
    imageUrl: string;
    likes: number;
    saved: boolean;
    eventName: string;
    place: {
        name: string;
        city?: string;
        country?: string;
        lat?: number;
        lng?: number;
    };
    createdAt?: string;
    author?: { id?: string; name?: string; avatarUrl?: string };
}