
import { FC } from 'react';
import { ICell } from '../../../../../model/Cell';
import { Cell } from './Cell';
import { ICellWrapper } from './Cell.interface';

export const CellsWrapper: FC<ICellWrapper> =({ cells, onSelect, isFlipped, selected }) => {

    const direction = (ind: number) => {
        return isFlipped ? 7 - ind : ind;
    }
    return (
        <>
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
                            />

                        )
                    })
                })
            }

        </>
    )
}