import { ValidationError } from 'class-validator';
import { MatchDuration } from '../../../client/src/constants/constants';
import { IGameRoomShortData } from '../../../client/src/constants/socketIO/ServerEvents.interface';
import { IPlayer } from '../../../client/src/model/Player';
import { roomApi } from '../model/room';
import { RoomService } from '../socket-service/room.service';

export const formErrorMessage = (errors: ValidationError[]) => {
    const message = errors.map(error => `${error.property} - ${Object.values(error.constraints!).join(', ')}`).join('; ');
    return message;
}

export const getInitTime = (room: string) => {
    if (room.includes('_1min')) return MatchDuration.ONE_MIN;
    if (room.includes('_10min')) return MatchDuration.TEN_MIN;
    if (room.includes('_3min')) return MatchDuration.THREE_MIN;
    return MatchDuration.FIVE_MIN;

}


export const getCurrentGames = (rooms: Map<string, Set<string>>) => {

    const games: IGameRoomShortData[] = [];

    for (let [room, players] of rooms) {
        if (room.includes('_1min') || room.includes('_10min') || room.includes('_3min')) {
            const players = roomApi(room).getRoomInfo().players;
            if (!players) continue;
            games.push({ room, players });
        }
    }

    return games;
}
