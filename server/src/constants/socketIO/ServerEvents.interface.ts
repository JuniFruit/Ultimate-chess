import { Colors } from '../../../../client/src/model/colors.enum';
import { IPlayerInfo } from '../../../../client/src/components/ui/player/PlayerInfo.interface';


export interface IStartPayload {
    color?: Colors,
    score?: number,
    user?: IPlayerInfo
}

export interface IOServerEvents {
    readyToStart: ({ }: IStartPayload) => void;
    noOpponent: () => void;
}