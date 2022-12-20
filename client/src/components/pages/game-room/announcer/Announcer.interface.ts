import { IBoardStates } from "../../../../model/Board";
import { Colors } from "../../../../model/colors.enum";
import { IPlayerInfo } from "../../../ui/player/PlayerInfo.interface"


export interface IAnnouncer {
    players: {
        client?: IPlayerInfo;
        opponent?: IPlayerInfo;
    },
    states: IBoardStates;
    myColor: Colors;
}
