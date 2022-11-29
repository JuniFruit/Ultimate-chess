import { IField } from "./Field.interface"
import { useEffect, useState, useCallback } from 'react';
import { ICell } from "../../../../model/Cell";

interface IUseField extends Pick<IField, 'board' | 'setBoard' | 'ioMoveHandlers'> {

}


export const useField = ({ board, setBoard, ioMoveHandlers }: IUseField) => {

    const [selectedCell, setSelectedCell] = useState<ICell | null>(null);


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
            selectedCell!.moveFigure(cell, board);
            ioMoveHandlers.handleSendMove({
                targetCell: {
                    x: cell.x,
                    y: cell.y
                }, currentCell: {
                    x: selectedCell.x,
                    y: selectedCell.y
                }
            });
            board.addMove(cell);
        }
        setBoard(prev => prev.getCopyBoard())
    }

    useEffect(() => {
        if (!selectedCell) return;
        showAvailableMoves(selectedCell);
    }, [selectedCell, setSelectedCell])

    useEffect(() => {

        if (!board.cells.length) return;
        board.updateAllLegalMoves();
        board.isKingChecked();
        console.log(board);
        if (board.isCheck) {
            console.log(board.isCheckMate());

        }

    }, [board, setBoard])

    return {
        handlers: {
            handleMove,
            handleSelect,
            showAvailableMoves
        },
        status: {
            selectedCell
        }
    }

}