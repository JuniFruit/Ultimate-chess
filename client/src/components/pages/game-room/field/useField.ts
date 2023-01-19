import { useCallback, useContext, useEffect, useState } from 'react';
import { AudioCtx } from "../../../../audio-engine/audio.provider";
import { AudioContextType } from "../../../../audio-engine/audio.types";
import { IMove, IMoveOptions } from "../../../../constants/socketIO/ClientEvents.interface";
import { useIsMobile } from "../../../../hooks/useMobile";
import { ICell, IPremove } from "../../../../model/Cell";
import { Colors } from '../../../../model/colors.enum';
import { FigureTypes, IFigure } from "../../../../model/figures/figures.interface";
import { ICellUlt } from "../../../../model/ultimate/CellUlt";
import { IField } from "./Field.interface";
import { useSound } from './useSound';

export interface IUseField extends Pick<IField, 'board' | 'myColor' | 'isObserver' | "isUltimate"> {
    handleSendMove: (move: IMove) => void;
}

export const useField = ({ board, myColor, isObserver, handleSendMove, isUltimate }: IUseField) => {


    const { isMobile } = useIsMobile();
    const [selectedCell, setSelectedCell] = useState<ICell | ICellUlt | null>(null);
    const [isPromotion, setIsPromotion] = useState(false);
    const [lastTargetCell, setLastTargetCell] = useState<ICell | ICellUlt | null>(null);
    const [premoves, setPremoves] = useState<IPremove[]>([]);
    const { playAnnounce } = useContext(AudioCtx) as AudioContextType;
    const maxPremoves = isMobile ? 1 : 5;

    useSound(board, isUltimate)


    const handleSelect = useCallback((cell: ICell | ICellUlt) => {
        if (isPromotion) return;
        if (isObserver) return setSelectedCell(prev => cell);
        if (selectedCell) {
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

                return setPremoves(prev => [...prev, {
                    figureType: selectedCell?.figure?.type!,
                    to: cell
                }]);
            }
            if (selectedCell === cell && board.states.currentPlayer !== myColor) {
                return clearSelectedCells()
            }

        } else {
            if (!cell.figure) return;
            setSelectedCell(prev => cell);
        }

    }, [selectedCell, lastTargetCell, isObserver, premoves.length, isPromotion, board])


    const handlePremoves = useCallback(() => {
        const premovesCopy = [...premoves];
        const current = premovesCopy.shift();
        if (!current || !selectedCell) return;
        if (current.figureType !== selectedCell.figure?.type) return clearSelectedCells();

        handleMove(selectedCell, current.to);
        setPremoves(prev => [...premovesCopy]);

    }, [selectedCell, premoves.length])

    const handlePromotion = useCallback((figureType: FigureTypes) => {

        if (!lastTargetCell || !selectedCell || isObserver) return;

        handleMove(selectedCell, lastTargetCell, {
            isPromotion: true,
            figureToPromote: figureType
        });

        setIsPromotion(prev => false);
        setSelectedCell(prev => null);
        setLastTargetCell(prev => null);

    }, [lastTargetCell, selectedCell, isObserver, isPromotion])

    const clearSelectedCells = useCallback(() => {
        setPremoves(prev => []);
        setSelectedCell(prev => null)
    }, [])

    const resetAnimationPos = useCallback((figure: IFigure) => {
        figure.animation?.updatePosition(figure.x, figure.y);
        myColor === Colors.BLACK && figure.animation?.flipPosition();
    }, [myColor])

    const handleMove = useCallback((from: ICell | ICellUlt, to: ICell | ICellUlt, options?: IMoveOptions) => {
        if (!from || !to || isObserver || board.states.isGameOver) return;
        if (!from.canMoveFigure(to, board)) {
            resetAnimationPos(from.figure!)
            return clearSelectedCells();
        }

        if (from.isPromotionMove(to) && !isPromotion) {
            playAnnounce('promotionVoice');
            resetAnimationPos(from.figure!)
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
        board.updateAllLegalMoves();
        setSelectedCell(to);
        handleSendMove({ from: { ...from.getCellInfo() }, to: { ...to.getCellInfo() }, options: { ...moveOptions } })


    }, [handleSelect])

    useEffect(() => {
        if (!board.cells.length) return;
        if (board.states.isGameOver) return clearSelectedCells()
        if (isObserver) return;
        if (board.states.currentPlayer === myColor) handlePremoves();

    }, [board.states.globalMovesCount, board.states.isGameOver, board.states.currentPlayer, board.cells.length, isObserver])

    return {
        handlers: {
            handleSelect,
            handlePromotion,
            handleSendMove,

        },
        status: {
            selectedCell,
            isPromotion,
            premoves
        }
    }

}