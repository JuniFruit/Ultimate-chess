import { IMessage } from "../../../../../../constants/socketIO/ClientEvents.interface";
import { IMessagePayload } from "../../../../../../constants/socketIO/ServerEvents.interface";


export interface IChatField {
    messages: IMessagePayload[];
    onSend: (msg: IMessage) => void
}