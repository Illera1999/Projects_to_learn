export interface PostEntity {
    id: string;
    image: string;
    likes: number;
    isSaved: boolean;
    event: {
        name: string;
        placeLabel: string; 
        coords?: { lat: number; lng: number };
    };
    createdAt: Date | null;
    authorName: string;
    authorAvatar?: string;
}