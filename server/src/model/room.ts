import { IResultPayload } from '../../../client/src/constants/socketIO/ServerEvents.interface';
import { IPlayer } from '../../../client/src/model/Player';


const ROOMS = new Map<string, IRoomInfo>();

export interface IRoomInfo {
    players?: IPlayer[];
    isGameStarted?: boolean;
    result?: IResultPayload | null;
    //...other states
}
export const roomApi = (roomId: string) => {

    const getRoomInfo = () => {
        const room = ROOMS.get(roomId);
        if (!room) return createRoom();
        return room
    }

    const updateRoomInfo = (payload: IRoomInfo) => {
        const prev = getRoomInfo();
        ROOMS.set(roomId, { ...prev, ...payload });
    }

    const createRoom = () => {
        const room: IRoomInfo = {
            players: [],
            isGameStarted: false,
            result: null,    
        }

        ROOMS.set(roomId, room);
        return room;
    }

    const clearRoom = () => {
        ROOMS.delete(roomId);
    }

    const getPlayer = (username: string) => {
        const players = getRoomInfo().players;
        return players?.find(player => player.username === username);
    }

    return {
        getRoomInfo,
        updateRoomInfo,
        createRoom,
        getPlayer,
        clearRoom
    }
}