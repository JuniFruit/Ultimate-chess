import { IField } from "./Field.interface"
import { useEffect, useState, useCallback } from 'react';
import { ICell } from "../../../../model/Cell";
import { FigureTypes } from "../../../../model/figures/Figures";
import { IMoveOptions } from "../../../../constants/socketIO/ClientEvents.interface";


interface IUseField extends Pick<IField, 'board' | 'setBoard' | 'ioMoveHandlers'> {

}


export const useField = ({ board, setBoard, ioMoveHandlers }: IUseField) => {

    const [selectedCell, setSelectedCell] = useState<ICell | null>(null);
    const [isPromotion, setIsPromotion] = useState(false);
    const [lastChosenCell, setLastChosenCell] = useState<ICell | null>(null);

    const showAvailableMoves = (cell: ICell) => {
        board.showAvailable(cell);
        setBoard(prev => prev.getCopyBoard());
    }

    const handleSelect = (cell: ICell) => {
        if (isPromotion) return; 

        if (selectedCell) {
            if (selectedCell !== cell && selectedCell.figure?.color !== cell.figure?.color) {
                if (selectedCell.figure?.type === FigureTypes.PAWN && (cell.y === 0 || cell.y === 7)) {
                    setLastChosenCell(prev => cell);
                    setIsPromotion(prev => true);                    
                    return
                }
                handleMove(cell);
                setSelectedCell(prev => null);
                return;
            } else if (selectedCell === cell) {
                return setSelectedCell(prev => null);
            } else if (selectedCell !== cell && cell.figure) return setSelectedCell(cell);
        } else {
            if (!cell.figure) return;
            setSelectedCell(prev => cell);

        }

    }

    const handlePromotion = (figureType: FigureTypes) => {

        if (!lastChosenCell || !selectedCell) return;        
        setSelectedCell(prev => {
            prev!.figure = board.createFigure(figureType,prev!.x,prev!.y);
            prev?.figure?.legalMoves.push(lastChosenCell);
            return prev;
        })      
        // start.figure = board.createFigure(figureType,start.x,start.y);
        console.log(selectedCell.figure?.legalMoves);
        handleMove(lastChosenCell, {isPromotion: true, figureToPromote: figureType});
        setIsPromotion(prev => false);
        setSelectedCell(prev => null);
        

    }

    const handleMove = (cell: ICell, options?:IMoveOptions) => {
        if (!cell || !selectedCell) return;

        const canMove = selectedCell.canMoveFigure(cell, board);

        if (canMove) {
            selectedCell!.moveFigure(cell, board);
            board.swapPlayer();
            ioMoveHandlers.handleSendMove({
                targetCell: {
                    x: cell.x,
                    y: cell.y
                }, currentCell: {
                    x: selectedCell.x,
                    y: selectedCell.y
                },
                options
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

        console.log(board);
        if (!board.cells.length) return;
        board.updateAllLegalMoves();
        board.isKingChecked();
        console.log(board.isCheck, board.currentPlayer);
        if (board.isCheck) {
            console.log(board.isCheckMate());

        }

    }, [board, setBoard])

    return {
        handlers: {
            handleMove,
            handleSelect,
            showAvailableMoves,
            handlePromotion
        },
        status: {
            selectedCell,
            isPromotion
        }
    }

}