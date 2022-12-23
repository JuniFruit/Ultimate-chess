import { Colors } from "../../colors.enum";
import { ISpritesObj } from "../../figures/figures.interface";
import { Knight } from "../../figures/Knight";
import { FigureUlt } from "./FiguresUlt";



export class KnightUlt extends Knight {
    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
    }
}