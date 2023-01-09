
import { ISocketData } from '../../../../client/src/constants/socketIO/ServerEvents.interface'
import { IOServerEvents } from '../../../../client/src/constants/socketIO/ServerEvents.interface';

export interface ISocketDataServer extends ISocketData {
    room?: string;
}
export interface IServerEvents extends IOServerEvents { }