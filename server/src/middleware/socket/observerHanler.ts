import { Socket } from "socket.io";
import { IClientEvents } from "../../constants/socketIO/ClientEvents.interface";

export const observerGuard = (socket:Socket, [events, ...args]: [IClientEvents, any], next: any) => {

    if (events.sendMove! && socket.data.isObserver) console.log(socket.data);

    next();

}