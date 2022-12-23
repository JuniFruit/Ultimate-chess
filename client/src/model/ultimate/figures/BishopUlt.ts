import { Colors } from "../../colors.enum";
import { Bishop } from "../../figures/Bishop";
import { ISpritesObj } from "../../figures/figures.interface";
import { FigureUlt } from "./FiguresUlt";



export class BishopUlt extends Bishop {

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);    
    }
}