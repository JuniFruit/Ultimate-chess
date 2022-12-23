import { Colors } from "../../colors.enum";
import { ISpritesObj } from "../../figures/figures.interface";
import { Rook } from "../../figures/Rook";
import { FigureUlt } from "./FiguresUlt";



export class RookUlt extends Rook {
    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
    }
}