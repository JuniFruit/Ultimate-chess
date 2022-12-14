import { FC, MouseEvent } from 'react';
import styles from './Promotion.module.scss';
import { SPRITES } from '../../../../assets/Packs/Default/sprites';
import { IPromotionWindow } from './Promotion.interface';
import { PieceInfo } from '../piece-info/PieceInfo';
import { FigureTypes } from '../../../../model/figures/figures.interface';

const PromotionWindow: FC<IPromotionWindow> = ({ handlePromotion }) => {

    function handleClick(e: MouseEvent<HTMLButtonElement>) {
        const value = e.currentTarget.value as FigureTypes;
        handlePromotion(value);
    }

    return (
        <div className={styles.wrapper}>
            <button value={FigureTypes.BISHOP} onClick={handleClick}>
                <PieceInfo spriteSrc={SPRITES.whiteBishop} />
            </button>
            <button value={FigureTypes.KNIGHT} onClick={handleClick}>
                <PieceInfo spriteSrc={SPRITES.whiteKnight} />
            </button>
            <button value={FigureTypes.QUEEN} onClick={handleClick}>
                <PieceInfo spriteSrc={SPRITES.whiteQueen} />
            </button>
            <button value={FigureTypes.ROOK} onClick={handleClick}>
                <PieceInfo spriteSrc={SPRITES.whiteRook} />
            </button>

        </div>
    )
}


export default PromotionWindow;