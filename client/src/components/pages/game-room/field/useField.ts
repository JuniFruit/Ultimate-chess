import { IField } from "./Field.interface"
import { useEffect, useState } from 'react';
import { ICell } from "../../../../model/Cell";
import { FigureTypes } from "../../../../model/figures/Figures";
import { IMoveOptions } from "../../../../constants/socketIO/ClientEvents.interface";
import { Colors } from "../../../../model/colors.enum";


interface IUseField extends Pick<IField, 'board' | 'setBoard' | 'ioMoveHandlers' | 'myColor'> {

}


export const useField = ({ board, setBoard, ioMoveHandlers, myColor }: IUseField) => {

    const [selectedCell, setSelectedCell] = useState<ICell | null>(null);
    const [isPromotion, setIsPromotion] = useState(false);
    const [lastChosenCell, setLastChosenCell] = useState<ICell | null>(null);

    const showAvailableMoves = (cell: ICell) => {
        board.showAvailable(cell);
        setBoard(prev => prev.getCopyBoard());
    }

    const handleSelect = (cell: ICell) => {
        if (isPromotion || board.states.isGameOver) return;

        if (selectedCell) {
            if (selectedCell !== cell
                && board.states.currentPlayer === myColor) {

                if (selectedCell.canMoveFigure(cell, board)) {
                    if (selectedCell.figure?.type === FigureTypes.PAWN && (cell.y === 0 || cell.y === 7)) {
                        setLastChosenCell(prev => cell);
                        setIsPromotion(prev => true);
                        return
                    }
                    handleMove(cell);
                    setSelectedCell(prev => null);
                    return;
                } else if (cell.figure) return setSelectedCell(prev => cell);
            } else if (selectedCell.figure?.color === cell.figure?.color) return setSelectedCell(prev => cell);
            return setSelectedCell(prev => null);
        } else {
            if (!cell.figure) return;
            setSelectedCell(prev => cell);

        }

    }

    const handlePromotion = (figureType: FigureTypes) => {

        if (!lastChosenCell || !selectedCell) return;
        setSelectedCell(prev => {
            board.popFigure(prev!.figure!);
            prev!.figure = board.createFigure(myColor === Colors.BLACK ? figureType : figureType.toUpperCase(), prev!.x, prev!.y);
            board.figures.push(prev!.figure!)
            return prev;
        })
        handleMove(lastChosenCell, { isPromotion: true, figureToPromote: myColor === Colors.BLACK ? figureType : figureType.toUpperCase() });
        setIsPromotion(prev => false);

        setSelectedCell(prev => null);


    }

    const handleMove = (cell: ICell, options?: IMoveOptions) => {
        if (!cell || !selectedCell) return;

        selectedCell!.moveFigure(cell, board);
        board.states.isFirstMove = false;
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

        setBoard(prev => prev.getCopyBoard())
    }

    useEffect(() => {
        if (!selectedCell) return;
        if (selectedCell.figure?.color !== myColor) return;
        showAvailableMoves(selectedCell);
    }, [selectedCell, setSelectedCell])

    useEffect(() => {

        if (!board.cells.length) return;
        console.log(board);
        console.log(board.states.currentPlayer, myColor)
        if (board.isKingChecked()) {
            console.log(board.isCheckMate())
        } 
     

    }, [board.states.currentPlayer])

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