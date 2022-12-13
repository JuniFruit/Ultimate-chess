import { FC, MouseEvent } from 'react';
import styles from './Promotion.module.scss';
import { SPRITES } from '../../../../assets/Packs/Default/sprites';
import { IPromotionWindow } from './Promotion.interface';
import { FigureTypes } from '../../../../model/figures/Figures';
import { PieceInfo } from '../piece-info/PieceInfo';

const PromotionWindow: FC<IPromotionWindow> = ({ handlePromotion }) => {

    function handleClick(e: MouseEvent<HTMLButtonElement>) {
        const value = e.currentTarget.value as FigureTypes;
        handlePromotion(value);
    }

    return (
        <div className={styles.wrapper}>
            <button value={FigureTypes.BISHOP} onClick={handleClick}>
                <PieceInfo sprite={SPRITES.whiteBishop} />
            </button>
            <button value={FigureTypes.KNIGHT} onClick={handleClick}>
                <PieceInfo sprite={SPRITES.whiteKnight} />
            </button>
            <button value={FigureTypes.QUEEN} onClick={handleClick}>
                <PieceInfo sprite={SPRITES.whiteQueen} />
            </button>
            <button value={FigureTypes.ROOK} onClick={handleClick}>
                <PieceInfo sprite={SPRITES.whiteRook} />
            </button>

        </div>
    )
}


export default PromotionWindow;