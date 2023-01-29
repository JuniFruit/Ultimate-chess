import { Requests } from "../../../../../constants/constants";
import { Colors } from "../../../../../model/colors.enum";
import { ILostFigure, IMovedFigure } from "../../../../../model/figures/figures.interface";
import { IChatField } from "./chat-field/ChatField.interface";

export type activeWindow = 'game' | 'chat';


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
    chatProps: IChatField;
    activeWindow: activeWindow;
    isNewMsg: boolean;
    setActiveWindow: (Window: activeWindow) => void;
    setIsNewMsg: (value: boolean) => void;

}