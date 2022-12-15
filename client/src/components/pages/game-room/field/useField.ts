import { IField } from "./Field.interface"
import { useEffect, useState, useCallback } from 'react';
import { ICell } from "../../../../model/Cell";
import { IMoveOptions } from "../../../../constants/socketIO/ClientEvents.interface";
import { FigureTypes } from "../../../../model/figures/figures.interface";
import { useIOField } from "./useIOField";


export interface IUseField extends Pick<IField, 'board' | 'setBoard' | 'myColor' | 'isObserver'> { }

export const useField = ({ board, setBoard, myColor, isObserver }: IUseField) => {

    const [selectedCell, setSelectedCell] = useState<ICell | null>(null);
    const [isPromotion, setIsPromotion] = useState(false);
    const [lastTargetCell, setLastTargetCell] = useState<ICell | null>(null);
    const [premoves, setPremoves] = useState<ICell[]>([]);
    const maxPremoves = 5;
    const { handleSendMove } = useIOField({ board, setBoard, isObserver });

    const handleSelect = useCallback((cell: ICell) => {
        if (isPromotion || board.states.isGameOver) return;

        if (isObserver) return setSelectedCell(prev => cell);

        if (selectedCell) {
            if (selectedCell !== cell
                && board.states.currentPlayer === myColor) {

                if (selectedCell.canMoveFigure(cell, board)) {
                    if (selectedCell.figure?.type === FigureTypes.PAWN && (cell.y === 0 || cell.y === 7)) {
                        setLastTargetCell(prev => cell);
                        setIsPromotion(prev => true);
                        return
                    }
                    handleMove(cell);
                    setSelectedCell(prev => null);
                    return;
                }
                setPremoves(prev => []);
                if (cell.figure) return setSelectedCell(prev => cell);

            } else if (selectedCell !== cell && board.states.currentPlayer !== myColor) {
                if (premoves.length >= maxPremoves) return;
                return setPremoves(prev => [...prev, cell]);
            }
            setPremoves(prev => []);
            // if (selectedCell.figure?.color === cell.figure?.color) return setSelectedCell(prev => cell);
            return setSelectedCell(prev => null);
        } else {
            if (!cell.figure) return;

            if (cell.figure?.color !== myColor) {
                setSelectedCell(prev => cell);
                return setPremoves(prev => []);
            }

            setSelectedCell(prev => cell);

        }

    }, [selectedCell, lastTargetCell, isPromotion, board, isObserver, premoves])

    const handlePremoves = useCallback(() => {
        const premovesCopy = [...premoves];
        const current = premovesCopy.shift();
        if (!current) return;
        handleSelect(current);
        setSelectedCell(prev => current)
        setPremoves(prev => {
            prev.unshift()
            return prev;
        })
    }, [selectedCell, premoves, lastTargetCell])

    const handlePromotion = useCallback((figureType: FigureTypes) => {

        if (!lastTargetCell || !selectedCell || isObserver) return;

        handleMove(lastTargetCell, {
            isPromotion: true,
            figureToPromote: figureType
        });

        setIsPromotion(prev => false);
        setSelectedCell(prev => null);
        setLastTargetCell(prev => null);

    }, [lastTargetCell, selectedCell, board])

    const handleMove = useCallback((cell: ICell, options?: IMoveOptions) => {
        if (!cell || !selectedCell || isObserver) return;

        selectedCell!.moveFigure(cell, board);

        board.states.isFirstMove = false;

        if (isPromotion) cell.handlePromotion(options?.figureToPromote!, board);
        board.swapPlayer();

        handleSendMove({
            targetCell: {
                x: cell.x,
                y: cell.y
            }, currentCell: {
                x: selectedCell.x,
                y: selectedCell.y
            },
            options
        });

        setBoard(prev => prev.getCopyBoard())
    }, [selectedCell, lastTargetCell, isPromotion, board])

    useEffect(() => {

        if (!board.cells.length) return;
        // console.log(board);
        // console.log(board.states.currentPlayer, myColor)
        board.updateAllLegalMoves();
        if (board.isKingChecked()) {
            console.log(board.isCheckMate())
        }


    }, [board])

    return {
        handlers: {
            handleSelect,
            handlePromotion
        },
        status: {
            selectedCell,
            isPromotion,
            premoves
        }
    }

}