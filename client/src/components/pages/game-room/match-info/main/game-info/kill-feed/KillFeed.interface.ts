import { IGameInfo } from "../GameInfo.interface";


export interface IKillFeed extends Pick<IGameInfo, "lostFigures" | "currentPlayer"> {}