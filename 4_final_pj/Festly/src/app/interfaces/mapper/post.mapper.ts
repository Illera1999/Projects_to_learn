import { PostDTO } from '../models/post.dto';
import { PostEntity } from '../models/post.entity';

export function mapPostDTOtoEntity(dto: PostDTO): PostEntity {
    const placeLabel = [
        dto.place?.name,
        dto.place?.city,
        dto.place?.country && dto.place.country.toUpperCase().slice(0, 2)
    ].filter(Boolean).join(', ');

    return {
        id: dto.id,
        image: dto.imageUrl,
        likes: dto.likes ?? 0,
        isSaved: !!dto.saved,
        event: {
            name: dto.eventName,
            placeLabel,
            coords: dto.place?.lat && dto.place?.lng
                ? { lat: dto.place.lat, lng: dto.place.lng }
                : undefined
        },
        createdAt: dto.createdAt ? new Date(dto.createdAt) : null,
        authorName: dto.author?.name ?? 'Anónimo',
        authorAvatar: dto.author?.avatarUrl
    };
}

export const mapPostsDTOtoEntities = (dtos: PostDTO[]) => dtos.map(mapPostDTOtoEntity);