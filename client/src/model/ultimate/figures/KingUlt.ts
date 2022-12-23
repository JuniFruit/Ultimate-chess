import { Colors } from "../../colors.enum";
import { ISpritesObj } from "../../figures/figures.interface";
import { King } from "../../figures/King";
import { FigureUlt } from "./FiguresUlt";


export class KingUlt extends King {


    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
    }
}