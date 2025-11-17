import { Timestamp } from '@angular/fire/firestore';
import { PostDTO } from '../models/post.dto';
import { PostEntity } from '../models/post.entity';


export function mapPostDTOtoEntity(dto: PostDTO): PostEntity {
    return {
        id: dto.id,
        likes: dto.likes,
        title: dto.title,
        eventName: dto.eventName,
        createdAt: dto.createdAt,
        author: dto.author
    };
}

export function mapPostEntityToDTO(entity: PostEntity): PostDTO {
    return {
        id: entity.id,
        likes: entity.likes,
        title: entity.title,
        eventName: entity.eventName,
        createdAt: entity.createdAt,
        author: entity.author
    };
}

export const mapPostsDTOtoEntities = (dtos: PostDTO[]) => dtos.map(mapPostDTOtoEntity);
export const mapPostsEntitiesToDTOs = (entities: PostEntity[]) => entities.map(mapPostEntityToDTO);