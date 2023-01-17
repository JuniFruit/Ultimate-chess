
import { IMovedFigure } from "../../../../../../../model/figures/figures.interface";
import { IGameInfo } from "../GameInfo.interface";

export interface IMoveFeed extends Pick<IGameInfo, "moves"> {}

export interface IMoveFeedItem {
    piece: IMovedFigure;
    listCount: number;
}

