import { IMovedFigure } from "../../../../../../model/figures/figures.interface";
import { ISkillUsed } from "../../../../../../model/ultimate/Skills";
import { IGameInfo } from "../GameInfo.interface";

export interface IMoveFeed extends Pick<IGameInfo, "moves"> {}

export interface IMoveFeedItem {
    piece: IMovedFigure;
    listCount: number;
}

