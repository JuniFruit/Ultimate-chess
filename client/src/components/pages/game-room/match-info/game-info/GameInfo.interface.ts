
import { IMatchInfo } from "../MatchInfo.interfact";

export interface IGameInfo extends Pick<IMatchInfo, "currentPlayer" | "moves" | "lostFigures"> {
 
}