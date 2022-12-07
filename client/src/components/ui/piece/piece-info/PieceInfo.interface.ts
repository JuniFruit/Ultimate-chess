import { ILostFigure } from "../../../../model/figures/Figures";


export interface IPieceInfo extends Pick<ILostFigure, "color" | "type" | "sprite"> {
    
}