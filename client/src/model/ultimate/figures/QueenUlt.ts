import { Colors } from "../../colors.enum";
import { ISpritesObj } from "../../figures/figures.interface";
import { Queen } from "../../figures/Queen";
import { FigureUlt } from "./FiguresUlt";



export class QueenUlt extends Queen {
    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
    }
}