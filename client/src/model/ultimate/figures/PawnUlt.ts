import { Colors } from "../../colors.enum";
import { ISpritesObj } from "../../figures/figures.interface";
import { Pawn } from "../../figures/Pawn";
import { FigureUlt } from "./FiguresUlt";



export class PawnUlt extends Pawn {
    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
    }
}