
import { FC } from 'react';
import { ICell } from '../../../../../model/Cell';
import { Cell } from './Cell';
import { ICellWrapper } from './Cell.interface';
import styles from '../Field.module.scss';
import CanvasField from '../canvas/CanvasField';

export const CellsWrapper: FC<ICellWrapper> = ({ cells, onSelect, isFlipped, selected, premoves, board, ultimateStates }) => {

    const direction = (ind: number) => {
        return isFlipped ? 7 - ind : ind;
    }   

    return (
        <div className={styles.cells}>
            <CanvasField 
                props={{cells, onSelect, isFlipped, selected, premoves, board, ultimateStates}}
                className={styles.canvas}
            />
            {/* {
                cells.map((row, y) => {
                    return row.map((cell: ICell, x) => {
                        let current: ICell = cells[direction(y)][direction(x)]
                        return (
                            <Cell
                                color={current.color}
                                figure={current.figure}
                                cell={current}
                                posX={direction(current.x)}
                                posY={direction(current.y)}
                                onSelect={onSelect}
                                selected={selected}
                                key={cell.x + cell.y}
                                isPremoved={premoves.some(move => move.to.x === current.x && move.to.y === current.y)}                            
                            />

                        )
                    })
                })
            } */}

        </div>
    )
}