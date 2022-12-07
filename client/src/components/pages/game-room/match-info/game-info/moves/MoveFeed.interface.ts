import { IGameInfo } from "../GameInfo.interface";

export interface IMoveFeed extends Pick<IGameInfo, "moves"> {}