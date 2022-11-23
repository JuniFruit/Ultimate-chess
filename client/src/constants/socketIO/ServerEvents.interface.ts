import { IPlayerInfo } from "../../components/ui/player/PlayerInfo.interface";
import { Colors } from "../../model/colors.enum";

export interface IStartPayload {
    color: Colors,
    score: number,
    user: IPlayerInfo
}

export interface IOServerEvents {
    readyToStart: ({}:IStartPayload) => void;
    noOpponent: () => void;
}