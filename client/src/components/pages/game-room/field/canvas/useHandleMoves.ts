import { ICanvasField } from "./CanvasField.interface";
import { useState, useRef, useCallback, TouchEventHandler, TouchEvent, MouseEventHandler, Touch } from 'react';
import { IFigure } from "../../../../../model/figures/figures.interface";
import { ICell } from "../../../../../model/Cell";
import { ICellUlt } from "../../../../../model/ultimate/CellUlt";
import { getFlippedPos } from "../../../../../model/helpers";

interface IUseHandleMoves extends Pick<ICanvasField, "isFlipped" | "onCellSelect"
    | "cells" | "ultimateStates" | "selected"> { }

export const useHandleMoves = ({ isFlipped, onCellSelect, cells, ultimateStates, selected }: IUseHandleMoves) => {

    const [isDragging, setIsDragging] = useState(false);
    const draggingPiece = useRef<IFigure | null>(null);
    const dragStartCell = useRef<ICell | null>(null);
    const ongoingTouch = useRef<Touch | null>(null)
    const prevMouseOver = useRef<ICell | ICellUlt | null>(null);

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

        draggingPiece.current = target.figure
        dragStartCell.current = cells[y][x];
        _setPieceToMouse(clientX, clientY, canvas);

        setIsDragging(prev => true);
        onCellSelect(target)

    }, [isDragging, cells.length, selected, ultimateStates.isSkillTargetSelecting])

    const _handleSelectEnd = useCallback((clientX: number, clientY: number, canvas: HTMLCanvasElement) => {
        if (ultimateStates.isSkillTargetSelecting) return; // only mouseDown handles skill target selection

        if (!draggingPiece.current || !dragStartCell.current) return;
        const { x, y } = _getCellPosFromMouse(clientX, clientY, canvas);
        const target = cells[y][x];

        if (dragStartCell.current !== target) {
            _clearDragging()
            onCellSelect(target);
            return;
        }
        _clearDragging();
    }, [isDragging, cells.length, ultimateStates.isSkillTargetSelecting])

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
        console.log(e)
        const { clientX, clientY } = touch;
        _handleSelectStart(clientX, clientY, canvas);
        ongoingTouch.current = touch

    }, [isDragging, cells.length, selected, ultimateStates.isSkillTargetSelecting])

    const handleTouchMove: TouchEventHandler<HTMLCanvasElement> = useCallback((e) => {

        const canvas = e.target as HTMLCanvasElement;
        const touch = e.changedTouches[0]
        const { clientX, clientY } = touch;
        _handleMovement(clientX, clientY, canvas);

    }, [isDragging, cells.length, selected, ultimateStates.isSkillTargetSelecting])

    const handleTouchEnd: TouchEventHandler<HTMLCanvasElement> = useCallback((e) => {

        const canvas = e.target as HTMLCanvasElement;
        const touch = e.changedTouches[0]
        const { clientX, clientY } = touch;
        _handleSelectEnd(clientX, clientY, canvas);

    }, [isDragging, cells.length, ultimateStates.isSkillTargetSelecting])

    const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        e.preventDefault()
        const canvas = e.target as HTMLCanvasElement;
        const { clientX, clientY } = e;
        _handleMovement(clientX, clientY, canvas)

    }, [isDragging, cells.length, selected, ultimateStates.isSkillTargetSelecting])

    const handleMouseOut: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        e.preventDefault()

        if (!draggingPiece.current) return;
        draggingPiece.current.x = draggingPiece.current.prevX
        draggingPiece.current.y = draggingPiece.current.prevY;

        _clearDragging();
    }, [isDragging, cells.length])

    const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        e.preventDefault()
        const canvas = e.target as HTMLCanvasElement;
        const { clientX, clientY } = e;

        _handleSelectStart(clientX, clientY, canvas);

    }, [isDragging, cells.length, selected, ultimateStates.isSkillTargetSelecting])


    const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        e.preventDefault();
        const canvas = e.target as HTMLCanvasElement;
        const { clientX, clientY } = e;

        _handleSelectEnd(clientX, clientY, canvas)

    }, [isDragging, cells.length, ultimateStates.isSkillTargetSelecting])




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