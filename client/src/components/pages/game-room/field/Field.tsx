import { useState, useEffect, FC, useRef } from 'react';
import { ICell } from "../../../../model/Cell";
import { Cell } from "./Cell";
import { IField } from "./Field.interface";
import styles from './Field.module.scss';



export const Field: FC<IField> = ({ board, setBoard, ioMoveHandlers, isFlipped }) => {

    const [selectedCell, setSelectedCell] = useState<ICell | null>(null);
   
    useEffect(() => {
        if (!selectedCell) return;
        showAvailableMoves(selectedCell);
    }, [selectedCell, setSelectedCell])

    const showAvailableMoves = (cell: ICell) => {
        board.showAvailable(cell);
        setBoard(prev => prev.getCopyBoard());
    }

    const handleSelect = (cell: ICell) => {

        if (selectedCell) {
            if (selectedCell !== cell && selectedCell.figure?.color !== cell.figure?.color) {
                handleMove(cell);
                setSelectedCell(null);

                return;
            } else if (selectedCell === cell) {
                return setSelectedCell(null);
            } else if (selectedCell !== cell && cell.figure) return setSelectedCell(cell);
        } else {
            if (!cell.figure) return;
            setSelectedCell(cell);

        }

    }

    const handleMove = (cell: ICell) => {
        if (!cell || !selectedCell) return;

        const canMove = selectedCell.canMoveFigure(cell, board);

        if (canMove) {
            selectedCell!.moveFigure(cell);
            console.log(board.isKingChecked());
            ioMoveHandlers.handleSendMove({ targetCell: cell, currentCell: selectedCell });
        }
    }

    const direction = (ind:number) => {
        return isFlipped ? 7 - ind : ind;
    }

    return (
        <div className={styles.field}>
            {
                board.cells.map((row, y) => {
                    return row.map((cell: ICell, x) => {
                        let current = board.cells[direction(y)][direction(x)]
                        return (
                            <Cell
                                color={current.color}
                                figure={current.figure}
                                cell={current}
                                onSelect={handleSelect}
                                selected={selectedCell}
                                isAvailable={current.isAvailable}
                                key={x+y}
                            />
                        )
                    })
                })
            }
        </div>
    )
}