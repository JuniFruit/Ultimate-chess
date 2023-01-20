import { SPRITES } from "../assets/Packs/Default/sprites";
import { IPlayerInfo } from "../components/ui/player/PlayerInfo.interface";
import { IBoard } from "../model/Board";
import { Colors } from "../model/colors.enum";
import { VFX } from "../model/effects/VFX";
import { FigureTypes, ILostFigure } from "../model/figures/figures.interface";
import { SkillNames } from "../model/ultimate/Skills";


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


export const setFigureAnimation = (board: IBoard, isFlipped:boolean) => {
    board.figures.forEach(figure => {
        const animation = new VFX({
            sprite: figure.spriteSrc!,
            framesMaxWidth: figure.sprites?.frames!,
            position: {
                x: figure.x,
                y: figure.y,
            },
            title: SkillNames.INCINERATE, // Any
            isLooped: true
        });
        animation.image.onerror = ((e: any) => {
            e.target.onerror = null;
            e.target.src = getDefaultSprite({ ...(figure) })
        })
        if (isFlipped) animation.flipPosition();
        figure.animation = animation;


    })
}
