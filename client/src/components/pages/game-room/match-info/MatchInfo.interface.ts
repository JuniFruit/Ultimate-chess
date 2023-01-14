import { Requests } from "../../../../constants/constants";
import { Colors } from "../../../../model/colors.enum";
import { ILostFigure, IMovedFigure } from "../../../../model/figures/figures.interface";


export interface IMatchInfo {
    onRequestDraw: () => void;
    onRequestResign: () => void;
    onConfirmDraw: () => void;
    onDeclineDraw: () => void;
    request: Requests | null;
    moves: IMovedFigure[]
    lostFigures: ILostFigure[]
    isObserver: boolean;  
    currentPlayer: Colors;
    isFirstMove:boolean;
    isGameOver: boolean;
}