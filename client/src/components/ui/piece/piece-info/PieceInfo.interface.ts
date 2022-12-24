import { ILostFigure } from "../../../../model/figures/figures.interface";


export interface IPieceInfo extends Pick<ILostFigure, "spriteSrc"> {
    title?: string
}