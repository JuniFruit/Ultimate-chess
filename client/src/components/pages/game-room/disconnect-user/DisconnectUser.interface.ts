import { IBoardStates } from "../../../../model/Board";

export interface IDisconnectUserComponent extends Pick<IBoardStates, "isFirstMove" | "isGameOver"> {
    isObserver: boolean;
}