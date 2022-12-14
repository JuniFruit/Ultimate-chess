import { Socket, RemoteSocket } from 'socket.io';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents, ISocketDataServer } from '../constants/socketIO/ServerEvents.interface';

export const observerGuard = (socket: Socket<IClientEvents, IServerEvents> | RemoteSocket<IServerEvents, ISocketDataServer>) => {
    if (socket.data.room.includes('_obs')) return true;
    return false;
}