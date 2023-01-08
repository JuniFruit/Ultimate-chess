import { ICanvasField } from "./CanvasField.interface";
import { useState, useRef, useCallback, TouchEventHandler, MouseEventHandler, useEffect } from 'react';
import { FigureTypes, IFigure } from "../../../../../model/figures/figures.interface";
import { ICell } from "../../../../../model/Cell";
import { ICellUlt } from "../../../../../model/ultimate/CellUlt";
import { getFlippedPos, isInBounds } from "../../../../../model/helpers";

interface IUseHandleMoves extends Pick<ICanvasField, "isFlipped" | "onCellSelect"
    | "cells" | "ultimateStates" | "selected" | "premoves"> { }

export const useHandleMoves = ({ isFlipped, onCellSelect, cells, ultimateStates, selected, premoves }: IUseHandleMoves) => {

    const [isDragging, setIsDragging] = useState(false);
    const [isTouchOngoing, setIsTouchOngoing] = useState(false);
    const draggingPiece = useRef<IFigure | null>(null);
    const dragStartCell = useRef<ICell | null>(null);
    const prevMouseOver = useRef<ICell | ICellUlt | null>(null);

    useEffect(() => {
        if (!isTouchOngoing) return;

        const timeout = setTimeout(() => {
            setIsTouchOngoing(prev => false);
        }, 2000)

        return () => {
            clearTimeout(timeout);
        }

    }, [isTouchOngoing])


    const _getCellPosFromMouse = useCallback((clientX: number, clientY: number, canvas: HTMLCanvasElement) => {

        const { x, y } = _getPosWithinBoard(clientX, clientY, canvas);
        if (isFlipped) return getFlippedPos(x, y);
        return { x: Math.floor(x), y: Math.floor(y) };
    }, [isFlipped, ultimateStates.isSkillTargetSelecting])



    const _getPosWithinBoard = useCallback((clientX: number, clientY: number, canvas: HTMLCanvasElement) => {
        const bounds = canvas.getBoundingClientRect();
        const x = Math.min(Math.max(0, clientX - bounds.x), bounds.width) / (bounds.width / 8);
        const y = Math.min(Math.max(0, clientY - bounds.y), bounds.height) / (bounds.height / 8);
        return { x, y }
    }, [])


    const _setPieceToMouse = useCallback((clientX: number, clientY: number, canvas: HTMLCanvasElement) => {
        if (!draggingPiece.current) return;

        const { x, y } = _getPosWithinBoard(clientX, clientY, canvas);
        const offset = .3;

        draggingPiece.current.x = isFlipped ? 7 - x + offset : x - offset;
        draggingPiece.current.y = isFlipped ? 7 - y + offset : y - offset;

    }, [isFlipped])

    const _setCellMouseOver = useCallback((clientX: number, clientY: number, canvas: HTMLCanvasElement) => {
        const { x, y } = _getCellPosFromMouse(clientX, clientY, canvas);
        const target = cells[y][x]

        if (prevMouseOver.current && prevMouseOver.current !== target) prevMouseOver.current.isMouseOver = false;

        target.isMouseOver = true;
        prevMouseOver.current = target;

    }, [ultimateStates.isSkillTargetSelecting])

    const _handleMovement = useCallback((clientX: number, clientY: number, canvas: HTMLCanvasElement) => {

        if (ultimateStates.isSkillTargetSelecting) _setCellMouseOver(clientX, clientY, canvas);

        if (!isDragging) return;
        _setPieceToMouse(clientX, clientY, canvas);

    }, [isDragging, cells.length, ultimateStates.isSkillTargetSelecting])

    const _handleSelectStart = useCallback((clientX: number, clientY: number, canvas: HTMLCanvasElement) => {

        const { x, y } = _getCellPosFromMouse(clientX, clientY, canvas);
        const target = cells[y][x];

        if (ultimateStates.isSkillTargetSelecting) {
            return ultimateStates.onSkillTargetSelect(target as ICellUlt);
        }

        if (target.figure) {
            if ((selected?.figure?.type === FigureTypes.KING
                && selected.figure.color === target.figure.color) && target.figure.type === FigureTypes.ROOK) return onCellSelect(target);
            draggingPiece.current = target.figure
            dragStartCell.current = cells[y][x];
            _setPieceToMouse(clientX, clientY, canvas);

            setIsDragging(prev => true);
        }

        onCellSelect(target)

    }, [cells.length, selected, ultimateStates.isSkillTargetSelecting, premoves, onCellSelect])

    const _handleSelectEnd = useCallback((clientX: number, clientY: number, canvas: HTMLCanvasElement) => {
        if (ultimateStates.isSkillTargetSelecting) return; // only mouseDown handles skill target selection

        if (!draggingPiece.current || !dragStartCell.current) return;
        const { x, y } = _getCellPosFromMouse(clientX, clientY, canvas);

        if (!isInBounds(x,y)) return _clearDragging();

        const target = cells[y][x];
        if (dragStartCell.current !== target) {
            _clearDragging()
            onCellSelect(target);
            return;
        }
        _clearDragging();
    }, [isDragging, cells.length, ultimateStates.isSkillTargetSelecting, premoves])

    const _clearDragging = useCallback(() => {
        if (!draggingPiece.current || !dragStartCell.current) return;
        draggingPiece.current.x = dragStartCell.current.x;
        draggingPiece.current.y = dragStartCell.current.y;
        dragStartCell.current = null;
        draggingPiece.current = null;
        setIsDragging(prev => false);
    }, [isDragging])

    // Handlers ..............................

    const handleTouchStart: TouchEventHandler<HTMLCanvasElement> = useCallback((e) => {
        const canvas = e.target as HTMLCanvasElement;
        const touch = e.changedTouches[0]
        const { clientX, clientY } = touch;
        _handleSelectStart(clientX, clientY, canvas);
        draggingPiece.current && draggingPiece.current.animation!.scaleBy(draggingPiece.current.animation!._scale * 2.5);
        if (isTouchOngoing) return;

        setIsTouchOngoing(prev => true);


    }, [isDragging, isTouchOngoing, cells.length, selected, ultimateStates.isSkillTargetSelecting, premoves, onCellSelect])

    const handleTouchMove: TouchEventHandler<HTMLCanvasElement> = useCallback((e) => {
        const canvas = e.target as HTMLCanvasElement;
        const touch = e.changedTouches[0]
        const { clientX, clientY } = touch;

        draggingPiece.current && draggingPiece.current.animation!.scaleBy(2.5);
        _handleMovement(clientX, clientY, canvas);

    }, [isDragging, cells.length, selected, ultimateStates.isSkillTargetSelecting])

    const handleTouchEnd: TouchEventHandler<HTMLCanvasElement> = useCallback((e) => {

        const canvas = e.target as HTMLCanvasElement;
        const touch = e.changedTouches[0]
        const { clientX, clientY } = touch;

        _handleSelectEnd(clientX, clientY, canvas);

    }, [isDragging, cells.length, ultimateStates.isSkillTargetSelecting, premoves])

    const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        if (isTouchOngoing) return;
        e.preventDefault()
        const canvas = e.target as HTMLCanvasElement;
        const { clientX, clientY } = e;
        _handleMovement(clientX, clientY, canvas)

    }, [isDragging, isTouchOngoing, cells.length, selected, ultimateStates.isSkillTargetSelecting])

    const handleMouseOut: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        e.preventDefault()
        _clearDragging();

    }, [cells.length])

    const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        if (isTouchOngoing) return;

        e.preventDefault()
        const canvas = e.target as HTMLCanvasElement;
        const { clientX, clientY } = e;

        _handleSelectStart(clientX, clientY, canvas);

    }, [isDragging, isTouchOngoing, cells.length, selected, ultimateStates.isSkillTargetSelecting, premoves, onCellSelect])


    const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        if (isTouchOngoing) return;

        e.preventDefault();
        const canvas = e.target as HTMLCanvasElement;
        const { clientX, clientY } = e;

        _handleSelectEnd(clientX, clientY, canvas)

    }, [isDragging, isTouchOngoing, cells.length, ultimateStates.isSkillTargetSelecting, premoves])




    return {
        handlers: {
            handleMouseDown,
            handleMouseMove,
            handleMouseOut,
            handleMouseUp,
            handleTouchStart,
            handleTouchEnd,
            handleTouchMove
        }
    }

}