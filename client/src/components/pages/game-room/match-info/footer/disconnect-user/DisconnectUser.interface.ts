import { IDisconnectedUser } from "../../../../../../constants/socketIO/ClientEvents.interface";

export interface IDisconnectUserComponent {
    disconnectedUser: IDisconnectedUser;
    onDisconnectTimeout: () => void;
}