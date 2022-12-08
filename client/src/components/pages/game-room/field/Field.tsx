import { FC } from 'react';
import { ICell } from "../../../../model/Cell";
import { Piece } from '../../../ui/piece/Piece';
import PromotionWindow from '../../../ui/piece/promotion/PromotionWindow';
import { Cell } from "./Cell";
import { IField } from "./Field.interface";
import styles from './Field.module.scss';
import { useField } from './useField';



export const GameField: FC<IField> = ({ board, setBoard, ioMoveHandlers, isFlipped, myColor }) => {

    const { handlers, status } = useField({ board, setBoard, ioMoveHandlers, myColor })

    const direction = (ind: number) => {
        return isFlipped ? 7 - ind : ind;
    }

    return (
        <div className={styles.field}>
            <div className={styles.cells}>
                {
                    board.cells.map((row, y) => {
                        return row.map((cell: ICell, x) => {
                            let current: ICell = board.cells[direction(y)][direction(x)]
                            return (
                                <>
                                    <Cell
                                        color={current.color}
                                        figure={current.figure}
                                        cell={current}
                                        onSelect={handlers.handleSelect}
                                        selected={status.selectedCell}
                                        isAvailable={current.isAvailable}
                                        key={cell.x + cell.y}
                                    />
                                    {current.figure ? <Piece
                                        sprite={current.figure?.sprite!}
                                        x={direction(x)}
                                        y={direction(y)}
                                        key={current.figure.sprite}
                                    /> : null
                                    }
                                </>
                            )
                        })
                    })
                }

            </div>
            {status.isPromotion && <PromotionWindow handlePromotion={handlers.handlePromotion} />}
        </div>
    )
}