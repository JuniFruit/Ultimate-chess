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
            <PieceInfo sprite={getDefaultSprite(piece)} key={piece.x + piece.y} />
            <p>{`${Positions[piece.x]}${7 - piece.y + 1}`}</p>
            {piece.figureTaken
                ?
                <>
                    <p>takes</p>
                    <PieceInfo sprite={getDefaultSprite(piece.figureTaken)} />
                </>
                : null
            }
            {piece.isCastling
                ?
                <PieceInfo sprite={iconsGeneral.castling} />

                : null
            }
        </>
    )
}