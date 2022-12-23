import { Colors } from "../../colors.enum";
import { Figure } from "../../figures/Figures";
import { FigureTypes, IFigure, IFigureBase, ISpritesObj } from "../../figures/figures.interface";


export interface IFigureBaseUlt extends IFigureBase {

}

export interface IFigureUlt extends IFigureBaseUlt {
    type: FigureTypes
}

export class FigureUlt extends Figure implements IFigureBaseUlt {

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
       super(x,y, color,sprites);
    }

}

