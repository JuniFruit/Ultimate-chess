import { SPRITES } from "../../assets/sprites";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure, FigureTypes } from "./Figures";


export class Knight extends Figure {
    readonly sprite: string;
    readonly type: FigureTypes;

    
    constructor(color: Colors, cell: ICell) {
        super(color, cell);
        this.sprite = color === Colors.BLACK ? SPRITES.blackKnight : SPRITES.whiteKnight;
        this.type = FigureTypes.KNIGHT;
    }
}