
import { FC, useRef } from 'react';
import { ICell } from '../../../../../model/Cell';
import { Cell } from './Cell';
import { ICellWrapper } from './Cell.interface';
import styles from '../Field.module.scss';

export const CellsWrapper: FC<ICellWrapper> = ({ cells, onSelect, isFlipped, selected, premoves }) => {

    const direction = (ind: number) => {
        return isFlipped ? 7 - ind : ind;
    }
    const fieldRef = useRef<HTMLDivElement>(null);
    const getFieldRefBounds = () => {
        return fieldRef.current?.getBoundingClientRect();
    }

    return (
        <div className={styles.cells} ref={fieldRef}>
            {
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
                                isPremoved={premoves.some(move => move === current)}
                                refCallback={getFieldRefBounds}
                            />

                        )
                    })
                })
            }

        </div>
    )
}