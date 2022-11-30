import { FC } from 'react';
import { ICell } from "../../../../model/Cell";
import PromotionWindow from '../../../ui/piece/promotion/PromotionWindow';
import { Cell } from "./Cell";
import { IField } from "./Field.interface";
import styles from './Field.module.scss';
import { useField } from './useField';



export const Field: FC<IField> = ({ board, setBoard, ioMoveHandlers, isFlipped }) => {

    const { handlers, status } = useField({ board, setBoard, ioMoveHandlers })

    const direction = (ind: number) => {
        return isFlipped ? 7 - ind : ind;
    }

    return (
        <div className={styles.field}>
            <div className={styles.cells}>
                {
                    board.cells.map((row, y) => {
                        return row.map((cell: ICell, x) => {
                            let current = board.cells[direction(y)][direction(x)]
                            return (
                                <Cell
                                    color={current.color}
                                    figure={current.figure}
                                    cell={current}
                                    onSelect={handlers.handleSelect}
                                    selected={status.selectedCell}
                                    isAvailable={current.isAvailable}
                                    key={x + y}
                                />
                            )
                        })
                    })
                }

            </div>
            {status.isPromotion && <PromotionWindow handlePromotion={handlers.handlePromotion} />}
            {/* <button onClick={() => { board.undo(); setBoard(prev => prev.getCopyBoard()) }}>Undo</button> */}
        </div>
    )
}