import { IField } from "./Field.interface"
import { useEffect, useState, useCallback } from 'react';
import { ICell, IPremove } from "../../../../model/Cell";
import { IMoveOptions } from "../../../../constants/socketIO/ClientEvents.interface";
import { FigureTypes } from "../../../../model/figures/figures.interface";
import { useIOField } from "./useIOField";


export interface IUseField extends Pick<IField, 'board' | 'setBoard' | 'myColor' | 'isObserver'> { }

export const useField = ({ board, setBoard, myColor, isObserver }: IUseField) => {

    const [selectedCell, setSelectedCell] = useState<ICell | null>(null);
    const [isPromotion, setIsPromotion] = useState(false);
    const [lastTargetCell, setLastTargetCell] = useState<ICell | null>(null);
    const [premoves, setPremoves] = useState<IPremove[]>([]);
    const maxPremoves = 5;

    const { handleSendMove } = useIOField({ board, setBoard, isObserver });

    const handleSelect = useCallback((cell: ICell) => {
        if (isPromotion || board.states.isGameOver) return;

        if (isObserver) return setSelectedCell(prev => cell);

        if (selectedCell) {
            if (!selectedCell.figure || selectedCell === cell) return clearSelectedCells();
            if (selectedCell !== cell && board.states.currentPlayer === myColor) {
                if (!selectedCell.isCastlingMove(cell) && cell.figure?.color === myColor) {
                    setPremoves(prev => [])
                    setSelectedCell(prev => cell);
                    return;
                }
                handleMove(selectedCell, cell);
                return;
            }
            if (selectedCell !== cell && board.states.currentPlayer !== myColor) {
                if (premoves.length >= maxPremoves) return clearSelectedCells();
                return addPremove(cell);
            }

        } else {
            if (!cell.figure) return;
            setSelectedCell(prev => cell);
        }

    }, [selectedCell, lastTargetCell, isPromotion, board, isObserver, premoves])

    const addPremove = useCallback((cell: ICell) => {
        setPremoves(prev => [...prev, {
            figureType: selectedCell?.figure?.type!,
            to: cell
        }])
    }, [premoves, selectedCell, lastTargetCell])

    const handlePremoves = useCallback(() => {
        const premovesCopy = [...premoves];
        const current = premovesCopy.shift();
        if (!current || !selectedCell) return;
        if (current.figureType !== selectedCell.figure?.type) return clearSelectedCells();

        handleMove(selectedCell, current.to);
        setPremoves(prev => [...premovesCopy]);

    }, [selectedCell, premoves, isPromotion, board])

    const handlePromotion = useCallback((figureType: FigureTypes) => {

        if (!lastTargetCell || !selectedCell || isObserver) return;

        handleMove(selectedCell, lastTargetCell, {
            isPromotion: true,
            figureToPromote: figureType
        });

        setIsPromotion(prev => false);
        setSelectedCell(prev => null);
        setLastTargetCell(prev => null);

    }, [lastTargetCell, selectedCell])

    const clearSelectedCells = useCallback(() => {
        setPremoves(prev => []);
        setSelectedCell(prev => null)
    }, [])

    const handleMove = useCallback((from: ICell, to: ICell, options?: IMoveOptions) => {
        if (!from || !to || isObserver) return;

        if (!from.canMoveFigure(to, board)) {
            return clearSelectedCells();
        }

        if (from.isPromotionMove(to) && !isPromotion) {
            setLastTargetCell(prev => to);
            setIsPromotion(prev => true);
            return
        }

        const moveOptions = {
            ...options,
            isTake: to.figure !== null,
            isCastling: from.isCastlingMove(to),         
        }
        board.incrementMoveCount();
        board.moveFigure(from, to, moveOptions);

        board.states.isFirstMove = false;
        board.swapPlayer();
        handleSendMove({ from: { ...from.getCellInfo() }, to: { ...to.getCellInfo() }, options: {...moveOptions}})
        setSelectedCell(to);

        setBoard(prev => prev.getCopyBoard())

    }, [selectedCell, lastTargetCell, isPromotion, board])

    useEffect(() => {

        if (!board.cells.length) return;
        board.updateAllLegalMoves();
        console.log(board);        
        if (board.states.currentPlayer === myColor) handlePremoves();

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