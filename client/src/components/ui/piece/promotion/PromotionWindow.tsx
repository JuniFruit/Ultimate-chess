
import { FC, MouseEventHandler, MouseEvent } from 'react';
import styles from './Promotion.module.scss';
import { Piece } from '../Piece';
import { SPRITES } from '../../../../assets/sprites';
import { IPromotionWindow } from './Promotion.interface';
import { FigureTypes } from '../../../../model/figures/Figures';

const PromotionWindow: FC<IPromotionWindow> = ({ handlePromotion }) => {

    function handleClick (e:MouseEvent<HTMLButtonElement>) {
        const value = e.currentTarget.value as FigureTypes;
        handlePromotion(value);
    }

    return (
        <div className={styles.wrapper}>
            <button value={FigureTypes.BISHOP} onClick={handleClick}>
                <Piece sprite={SPRITES.blackBishop} />
            </button>
            <button value={FigureTypes.KNIGHT} onClick={handleClick}>
                <Piece sprite={SPRITES.blackKnight} />
            </button>
            <button value={FigureTypes.QUEEN} onClick={handleClick}>
                <Piece sprite={SPRITES.blackQueen} />
            </button>
            <button value={FigureTypes.ROOK} onClick={handleClick}>
                <Piece sprite={SPRITES.blackRook} />
            </button>

        </div>
    )
}


export default PromotionWindow;