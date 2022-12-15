import { Requests } from "../../../../constants/constants";
import { IBoardStates } from "../../../../model/Board";


export interface IMatchInfo {
    onRequestDraw: () => void;
    onRequestResign: () => void;
    onConfirmDraw: () => void;
    onDeclineDraw: () => void;
    request: Requests | null;
    states: IBoardStates;
    isObserver: boolean;  
}