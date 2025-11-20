
import { EventDto } from '../models/event/event.dto';
import { EventEntity } from '../models/event/event.entity';
import { PostDTO } from '../models/post/post.dto';
import { PostEntity } from '../models/post/post.entity';


export function mapEventDTOtoEntity(dto: EventDto): EventEntity {
    return {
        id: dto.id,
        date: dto.date,
        eventName: dto.eventName,
        place: dto.place,
        genre: dto.genre
    };
}

export function mapEventEntityToDTO(entity: EventEntity): EventDto {
    return {
        id: entity.id,
        date: entity.date,
        eventName: entity.eventName,
        place: entity.place,
        genre: entity.genre
    };
}

export const mapEventsDTOtoEntities = (dtos: EventDto[]) => dtos.map(mapEventDTOtoEntity);
export const mapEventsEntitiesToDTOs = (entities: EventEntity[]) => entities.map(mapEventEntityToDTO);