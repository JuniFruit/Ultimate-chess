import { IBoardStates } from "../../../../../model/Board";
import { Colors } from "../../../../../model/colors.enum";
import { ITimer } from "../../../../ui/timer/Timer.interface";


export interface ITimerHandler extends Pick<ITimer, "initTime"> {
    states: Pick<IBoardStates, "isFirstMove" | "isGameOver">;
    myColor: Colors;
    isObserver: boolean;
    isStopped: boolean;
}