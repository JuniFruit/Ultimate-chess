
import {IStartPayload} from '../../../../client/src/constants/socketIO/ServerEvents.interface'
import { IOServerEvents } from '../../../../client/src/constants/socketIO/ServerEvents.interface';

export interface IStartData extends IStartPayload {
    room?:string
}
export interface IServerEvents extends IOServerEvents{}