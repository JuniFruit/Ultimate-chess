import { useState, useEffect, FC, useRef } from 'react';
import { ICell } from "../../../../model/Cell";
import { Cell } from "./Cell";
import { IField } from "./Field.interface";
import { useAnimate } from '../../../../hooks/useAnimate';
import styles from './Field.module.scss';



export const Field: FC<IField> = ({ board, setBoard, ioMoveHandlers }) => {

    const [selectedCell, setSelectedCell] = useState<ICell | null>(null);
    const renders = useRef(0);
    renders.current++;
    console.log({ renders: renders.current, board });
    useEffect(() => {
        if (!selectedCell) return;
        showAvailableMoves(selectedCell);
    }, [selectedCell, setSelectedCell])

    const showAvailableMoves = (cell: ICell) => {
        board.showAvailable(cell, board);
        setBoard(board);
    }

    const handleSelect = (cell: ICell) => {

        if (selectedCell) {
            if (selectedCell !== cell) {
                const isMoved = selectedCell.moveFigure(cell, board);
                isMoved && ioMoveHandlers.handleSendMove({ targetCell: cell, currentCell: selectedCell })
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


    return (
        <div className={styles.field}>
            {
                board.cells.map(row => {
                    return row.map((cell: ICell, index) => (
                        <Cell
                            color={cell.color}
                            figure={cell.figure}
                            cell={cell}
                            onSelect={handleSelect}
                            selected={selectedCell}
                            isAvailable={cell.isAvailable}
                            key={index}
                        />
                    ))
                })
            }
        </div>
    )
}