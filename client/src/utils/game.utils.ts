import { SPRITES } from "../assets/Packs/Default/sprites";
import { IPlayerInfo } from "../components/ui/player/PlayerInfo.interface";
import { Colors } from "../model/colors.enum";
import { FigureTypes, ILostFigure } from "../model/figures/figures.interface";


export const assignSpritePack = (userColor: Colors, user: IPlayerInfo, opponent: IPlayerInfo) => {

    if (userColor === Colors.BLACK) return opponent?.packInUse ? opponent?.packInUse : SPRITES;
    return user?.packInUse ? user?.packInUse : SPRITES;
}

export const getDefaultSprite = (figure: { type: FigureTypes, color: Colors }) => {
    const type = figure.color === Colors.BLACK ? figure.type : figure.type.toUpperCase();

    switch (type) {
        case 'b':
            return SPRITES.blackBishop;
        case 'r':
            return SPRITES.blackRook;
        case 'k':
            return SPRITES.blackKing;
        case 'p':
            return SPRITES.blackPawn;
        case 'q':
            return SPRITES.blackQueen;
        case 'n':
            return SPRITES.blackKnight;
        case 'B':
            return SPRITES.whiteBishop;
        case 'R':
            return SPRITES.whiteRook;
        case 'K':
            return SPRITES.whiteKing;
        case 'P':
            return SPRITES.whitePawn;
        case 'Q':
            return SPRITES.whiteQueen;
        case 'N':
            return SPRITES.whiteKnight;
    }

}


export const getFilteredLostFigures = (lostFigures: ILostFigure[]) => {
    const whiteMaterial = lostFigures.filter(figure => figure.color === Colors.WHITE);
    const blackMaterial = lostFigures.filter(figure => figure.color === Colors.BLACK);

    return [whiteMaterial, blackMaterial]
}