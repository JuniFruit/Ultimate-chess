import { IBoard, IBoardStates } from "../../../../../model/Board";
import { Colors } from "../../../../../model/colors.enum";
import { ITimer } from "../../../../ui/timer/Timer.interface";
import { Dispatch, SetStateAction } from "react";
import { IBoardUlt } from "../../../../../model/ultimate/BoardUlt";


export interface ITimerHandler extends Pick<ITimer, "initTime"> {
    states: Pick<IBoardStates, "isFirstMove" | "isGameOver" | "blackTime" | "whiteTime">;
    myColor: Colors;
    isObserver: boolean;
    isStopped: boolean;
    board: IBoard | IBoardUlt;
    setBoard: Dispatch<SetStateAction<IBoard>>
}