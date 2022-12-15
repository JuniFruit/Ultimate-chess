import { FC, useRef } from 'react';
import { Colors } from '../../../../model/colors.enum';
import PromotionWindow from '../../../ui/piece/promotion/PromotionWindow';
import { CellsWrapper } from './cells/CellsWrapper';
import { IField } from "./Field.interface";
import styles from './Field.module.scss';
import { useField } from './useField';



export const GameField: FC<IField> = (props) => {

    const { handlers, status } = useField({ ...props })

  
    return (
        <div className={styles.field}>
            <CellsWrapper
                cells={props.board.cells}
                isFlipped={props.myColor === Colors.BLACK}
                onSelect={handlers.handleSelect}
                selected={status.selectedCell}
                premoves={status.premoves}               
            />

            {status.isPromotion && <PromotionWindow handlePromotion={handlers.handlePromotion} />}
        </div>
    )
}