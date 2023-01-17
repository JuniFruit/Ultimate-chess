import { FC } from 'react';
import { iconsGeneral } from "../../../../../../../assets/icons/general/iconsGeneral";
import { Positions } from "../../../../../../../model/positions";
import { getDefaultSprite } from "../../../../../../../utils/game.utils";
import { PieceInfo } from "../../../../../../ui/piece/piece-info/PieceInfo";
import { IMoveFeedItem } from "./MoveFeed.interface";



export const MoveFeedItem: FC<IMoveFeedItem> = ({ piece, listCount }) => {


    return (
        <>

            <span>{listCount}.</span>
            <PieceInfo spriteSrc={getDefaultSprite(piece.figureMove)} key={piece.to.x + piece.to.y} title={'piece'} />
            <p>{`${Positions[piece.to.x]}${7 - piece.to.y + 1}`}</p>
            {piece.figureTaken
                ?
                <>
                    <p>takes</p>
                    <PieceInfo spriteSrc={getDefaultSprite(piece.figureTaken)} title={'piece'} />
                </>
                : null
            }
            {piece.options.isCastling
                ?
                <PieceInfo spriteSrc={iconsGeneral.castling} title={'castling'} />

                : null
            }
            {piece.options.isPromotion
                ?
                <PieceInfo spriteSrc={iconsGeneral.promotion} title={'promotion'} />
                : null

            }
            {piece.options.isEnPassant
                ?
                <PieceInfo spriteSrc={iconsGeneral.enPassant} title={'en passant'} />
                : null

            }

        </>

    )
}