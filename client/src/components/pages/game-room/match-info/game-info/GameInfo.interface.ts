import { Colors } from "../../../../../model/colors.enum";
import { ILostFigure, IMovedFigure } from "../../../../../model/figures/Figures";

export interface IGameInfo {
    moves: IMovedFigure[];
    lostFigures: ILostFigure[];
    currentPlayer: Colors;
}