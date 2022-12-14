import { FC } from 'react';
import PromotionWindow from '../../../ui/piece/promotion/PromotionWindow';
import { CellsWrapper } from './cells/CellsWrapper';
import { IField } from "./Field.interface";
import styles from './Field.module.scss';
import { useField } from './useField';



export const GameField: FC<IField> = (props) => {

    const { handlers, status } = useField({...props})   

    return (
        <div className={styles.field}>
            <div className={styles.cells}>
                <CellsWrapper 
                    cells={props.board.cells}
                    isFlipped={props.isFlipped}
                    onSelect={handlers.handleSelect}
                    selected={status.selectedCell}
                />

            </div>
            {status.isPromotion && <PromotionWindow handlePromotion={handlers.handlePromotion} />}
        </div>
    )
}