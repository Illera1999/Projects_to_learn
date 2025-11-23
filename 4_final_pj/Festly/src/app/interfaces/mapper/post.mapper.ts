import { PostDTO } from '../models/post/post.dto';
import { PostEntity } from '../models/post/post.entity';


export function mapPostDTOtoEntity(dto: PostDTO): PostEntity {
    return {
        id: dto.id,
        likes: dto.likes,
        title: dto.title,
        eventName: dto.eventName,
        createdAt: dto.createdAt,
        author: dto.author,
        imageUrl: dto.imageUrl
    };
}

export function mapPostEntityToDTO(entity: PostEntity): PostDTO {
    return {
        id: entity.id,
        likes: entity.likes,
        title: entity.title,
        eventName: entity.eventName,
        createdAt: entity.createdAt,
        author: entity.author,
        imageUrl: entity.imageUrl
    };
}

export const mapPostsDTOtoEntities = (dtos: PostDTO[]) => dtos.map(mapPostDTOtoEntity);
export const mapPostsEntitiesToDTOs = (entities: PostEntity[]) => entities.map(mapPostEntityToDTO);