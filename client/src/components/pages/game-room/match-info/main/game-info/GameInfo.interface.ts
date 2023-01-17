
import { IMatchInfo } from "../MatchInfo.interface";

export interface IGameInfo extends Pick<IMatchInfo, "currentPlayer" | "moves" | "lostFigures"> {
 
}