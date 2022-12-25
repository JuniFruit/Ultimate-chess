import { ICanvasField } from "./CanvasField.interface";
import { MouseEvent, MouseEventHandler, useCallback, useState, useRef } from 'react';
import { Colors } from "../../../../../model/colors.enum";
import { IFigure } from "../../../../../model/figures/figures.interface";
import { getCellSize, getFlippedPos } from "../../../../../model/helpers";
import { drawCircle, drawRect } from "./utils/canvas.utils";
import { ICell } from "../../../../../model/Cell";
import { COLORS } from "./utils/colors.utils";
import { ICellUlt } from "../../../../../model/ultimate/CellUlt";


export const useCanvasField = (
    { props: {
        cells,
        board,
        onSelect,
        premoves,
        isFlipped,
        selected,
        ultimateStates
    }
    }: ICanvasField) => {

    const [isDragging, setIsDragging] = useState(false);
    const draggingPiece = useRef<IFigure | null>(null);
    const dragStartCell = useRef<ICell | null>(null);
    const draggedOver = useRef<ICell | null>(null);

    const handlePreDraw = useCallback((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        board.figures.forEach(figure => figure.setSpriteObj());
        drawBoard(context, canvas);
        // drawDraggedOver(context, canvas);
        drawPremoves(context, canvas);
        drawAvailable(context, canvas);
        drawSelected(context, canvas);
    }, [cells.length, isFlipped, premoves.length, selected, board, draggedOver.current])

    const handlePostDraw = useCallback((context: CanvasRenderingContext2D, frameCount: number) => {
        return frameCount
    }, [])

    const draw = useCallback((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frameCount: number) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        drawFigures(context, canvas)
        context.font = '24px serif';
        context.fillText(`frame count : ${frameCount} :)`, 10, 190);
        context.fillStyle = '#000000'
        context.fill()
    }, [board, isFlipped])


    const drawFigures = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {

        board.figures.forEach((figure) => {
            if (figure.sprite) {
                figure.update(ctx, canvas, isFlipped);
            }
        })

    }, [board, isFlipped])

    const drawPremoves = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        premoves.forEach(move => {
            const { w, h } = getCellSize(canvas);
            const { x, y } = _getCellPosFromCoord(move.to.x, move.to.y)
            const fill = COLORS.CELL.premoved;
            drawRect({
                ctx,
                x: x * w,
                y: y * h,
                width: w,
                height: h,
                fill
            })
        })
    }, [premoves.length])

    const drawAvailable = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {

        cells.forEach(row => {
            row.forEach(cell => {
                const isAvailable = selected?.figure?.legalMoves.some(move => move.pos === cell.pos)
                if (isAvailable) {
                    const { w, h } = getCellSize(canvas)
                    const { x, y } = _getCellPosFromCoord(cell.x, cell.y)
                    drawCircle({
                        ctx, x: (x * w) + w / 2,
                        y: (y * h) + h / 2,
                        radius: w / 6,
                        fill: COLORS.CELL.available,
                        stroke: 'blue'
                    })
                }
            })
        })

    }, [selected, cells.length])

    const drawSelected = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        cells.forEach(row => {
            row.forEach(cell => {
                const isSelected = selected?.x === cell.x && selected?.y === cell.y
                if (isSelected) {
                    const { w, h } = getCellSize(canvas)
                    const { x, y } = _getCellPosFromCoord(cell.x, cell.y)
                    drawRect({
                        ctx,
                        x: x * w,
                        y: y * h,
                        width: w,
                        height: h,
                        fill: COLORS.CELL.selected
                    })
                }
            })
        })
    }, [selected, cells.length])


    const drawBoard = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        cells.forEach((row, y) => {
            return row.forEach((cell, x) => {
                const { w, h } = getCellSize(canvas);
                const fill = cell.color === Colors.BLACK ? COLORS.CELL.black : COLORS.CELL.white;
                drawRect({
                    ctx,
                    x: x * w,
                    y: y * h,
                    width: w,
                    height: h,
                    fill
                })
            })
        })
    }, [cells.length, isFlipped])

    const drawDraggedOver = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        if (!draggedOver.current) return;

        const { w, h } = getCellSize(canvas)
        const { x, y } = _getCellPosFromCoord(draggedOver.current.x, draggedOver.current.y)

        drawRect({
            ctx,
            x: x * w,
            y: y * h,
            width: w,
            height: h,
            fill: draggedOver.current.color === Colors.BLACK ? COLORS.CELL.black : COLORS.CELL.white,
            strokeWidth: 5,
            stroke: COLORS.CELL.draggedOver
        })
    }, [draggedOver.current, isDragging])


    const _getCellPosFromMouse = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
        const { x, y } = _getPosWithinBoard(e);
        if (isFlipped) return getFlippedPos(x, y);
        return { x: Math.floor(x), y: Math.floor(y) };
    }, [isFlipped])

    const _getCellPosFromCoord = useCallback((x: number, y: number) => {
        if (isFlipped) return getFlippedPos(x, y);
        return { x, y }
    }, [isFlipped])

    const _getPosWithinBoard = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = e.target as HTMLCanvasElement;
        const bounds = canvas.getBoundingClientRect();
        const x = Math.min(Math.max(0, e.clientX - bounds.x), bounds.width) / (bounds.width / 8);
        const y = Math.min(Math.max(0, e.clientY - bounds.y), bounds.height) / (bounds.height / 8);
        return { x, y }
    }, [])

    const _setPieceToMouse = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
        if (!draggingPiece.current) return;

        const { x, y } = _getPosWithinBoard(e);
        const offset = .3;

        draggingPiece.current.x = isFlipped ? 7 - x + offset : x - offset;
        draggingPiece.current.y = isFlipped ? 7 - y + offset : y - offset;

    }, [isFlipped])  

    const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        e.preventDefault()
        if (!isDragging) return;
        _setPieceToMouse(e);
        // const { x, y } = _getCellPosFromMouse(e);
        // draggedOver.current = cells[y][x]
    }, [isDragging, cells.length])

    const handleMouseOut: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        e.preventDefault()

        if (!draggingPiece.current) return;
        draggingPiece.current.x = draggingPiece.current.prevX
        draggingPiece.current.y = draggingPiece.current.prevY;

        clearDragging();
    }, [isDragging, cells.length])

    const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        e.preventDefault()
        const { x, y } = _getCellPosFromMouse(e);
        const target = cells[y][x];

        if (ultimateStates.isSkillTargetSelecting) {
            return ultimateStates.onSkillTargetSelect(target as ICellUlt);
        }


        draggingPiece.current = target.figure
        dragStartCell.current = cells[y][x];
        _setPieceToMouse(e);

        setIsDragging(prev => true);
        onSelect(target)
    }, [isDragging, cells.length, selected, ultimateStates.isSkillTargetSelecting])


    const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        if (ultimateStates.isSkillTargetSelecting) return; // only mouseDown handles skill target selection

        e.preventDefault()

        if (!draggingPiece.current || !dragStartCell.current) return;
        const { x, y } = _getCellPosFromMouse(e);
        const target = cells[y][x];
        if (dragStartCell.current !== target) {
            clearDragging()
            onSelect(target);
            return;
        }
        clearDragging();

    }, [isDragging, cells.length, ultimateStates.isSkillTargetSelecting])


    const clearDragging = useCallback(() => {
        if (!draggingPiece.current || !dragStartCell.current) return;
        draggingPiece.current.x = dragStartCell.current.x;
        draggingPiece.current.y = dragStartCell.current.y;
        dragStartCell.current = null;
        draggingPiece.current = null;
        draggedOver.current = null;
        setIsDragging(prev => false);
    }, [isDragging, dragStartCell, draggingPiece])

    return {

        canvas: {
            draw,
            handlePostDraw,
            handlePreDraw,
        },
        mouse: {
            handleMouseMove,
            handleMouseDown,
            handleMouseUp,
            handleMouseOut
        }

    }


}