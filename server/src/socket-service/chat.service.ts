import {Socket} from 'socket.io'; 
import { IServerEvents, IStartData } from '../constants/socketIO/ServerEvents.interface';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IMessage } from '../../../client/src/constants/socketIO/ClientEvents.interface';


export const ChatService = {
    onMessage(socket: Socket<IClientEvents, IServerEvents, any, IStartData>, payload: IMessage) {

        socket.to(socket.data.room!).emit("message", {
            body: payload.body,
            username: socket.data.user?.username!,
            timestamp: Date.now()
        })
    }
}