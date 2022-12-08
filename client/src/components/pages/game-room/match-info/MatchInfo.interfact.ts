import { Requests } from "../../../../constants/constants";
import { IGameInfo } from "./game-info/GameInfo.interface";

export interface IMatchInfo {
    onRequestDraw: () => void;
    onRequestResign: () => void;
    onConfirmDraw: () => void;
    onDeclineDraw: () => void;
    request: Requests | null;
    states: IGameInfo;
}