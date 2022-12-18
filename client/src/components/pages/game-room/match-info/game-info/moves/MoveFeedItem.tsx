import { IMoveFeedItem } from "./MoveFeed.interface"
import { FC } from 'react';
import { PieceInfo } from "../../../../../ui/piece/piece-info/PieceInfo";
import { getDefaultSprite } from "../../../../../../utils/game.utils";
import { Positions } from "../../../../../../model/positions";
import { iconsGeneral } from "../../../../../../assets/icons/general/iconsGeneral";


export const MoveFeedItem: FC<IMoveFeedItem> = ({ piece, listCount }) => {


    return (
        <>
            <span>{listCount}.</span>
            <PieceInfo sprite={getDefaultSprite(piece.figureMove)} key={piece.to.x + piece.to.y} title={'piece'} />
            <p>{`${Positions[piece.to.x]}${7 - piece.to.y + 1}`}</p>
            {piece.figureTaken
                ?
                <>
                    <p>takes</p>
                    <PieceInfo sprite={getDefaultSprite(piece.figureTaken)} title={'piece'}/>
                </>
                : null
            }
            {piece.options.isCastling
                ?
                <PieceInfo sprite={iconsGeneral.castling} title={'castling'} />

                : null
            }
            {piece.options.isPromotion
                ?
                <PieceInfo sprite={iconsGeneral.promotion} title={'promotion'} />
                : null

            }
            {piece.options.isEnPassant
                ?
                <PieceInfo sprite={iconsGeneral.enPassant} title={'en passant'} />
                : null

            }
        </>
    )
}