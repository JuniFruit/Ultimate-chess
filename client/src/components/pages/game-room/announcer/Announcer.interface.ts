import { Colors } from "../../../../model/colors.enum";
import { IBoardUltStates } from "../../../../model/ultimate/BoardUlt";
import { IPlayerInfo } from "../../../ui/player/PlayerInfo.interface"


export interface IAnnouncerBoardStates extends Pick<IBoardUltStates,
    "isFirstMove" | "isGameOver" | "blackKillCount"
    | "whiteKillCount" | "lostFigures" | "lostFiguresCount" | "skillsUsed" | "moves" | "globalMovesCount"> { }

export interface IAnnouncer {
    players: {
        client?: IPlayerInfo;
        opponent?: IPlayerInfo;
    },
    states: IAnnouncerBoardStates
    myColor: Colors;
    isUltimate: boolean
}
