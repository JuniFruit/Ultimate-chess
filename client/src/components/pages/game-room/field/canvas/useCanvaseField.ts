import { ICanvasField } from "./CanvasField.interface";
import { MouseEvent, MouseEventHandler, useCallback, useState, useRef } from 'react';
import { Colors } from "../../../../../model/colors.enum";
import { IFigure } from "../../../../../model/figures/figures.interface";
import { getFlippedPos } from "../../../../../model/helpers";
import { drawCircle, drawRect, getCellSize } from "./utils/canvas.utils";
import { ICell } from "../../../../../model/Cell";
import { COLORS } from "./utils/colors.utils";
import { ICellUlt } from "../../../../../model/ultimate/CellUlt";
import { IBoardUlt } from "../../../../../model/ultimate/BoardUlt";
import { setEffectsOnBoard } from "../../../../../model/effects/utils";


export const useCanvasField = (
    {
        cells,
        board,
        onCellSelect,
        premoves,
        isFlipped,
        selected,
        ultimateStates,
        isUltimate

    }: ICanvasField) => {

    const [isDragging, setIsDragging] = useState(false);
    const draggingPiece = useRef<IFigure | null>(null);
    const dragStartCell = useRef<ICell | null>(null);
    const prevMouseOver = useRef<ICell | ICellUlt | null>(null);
    const prevMoveCount = useRef<number>(board.states.globalMovesCount);

    const handlePreDraw = useCallback((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        board.figures.forEach(figure => figure.setSpriteObj());
        if (isUltimate && prevMoveCount.current !== board.states.globalMovesCount) setEffectsOnBoard(board as IBoardUlt);
        drawBoard(context, canvas);
        drawPremoves(context, canvas);
        drawAvailable(context, canvas);
        drawSelected(context, canvas);
        drawMouseOver(context, canvas)

        prevMoveCount.current = board.states.globalMovesCount;

    }, [cells.length, isFlipped, premoves.length, selected, board, isUltimate])
   

    const draw = useCallback((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frameCount: number) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        drawMouseOver(context, canvas)
        drawFigures(context, canvas)
        drawEffects(context, canvas);

        // context.font = '24px serif';
        // context.fillText(`frame count : ${frameCount} :)`, 10, 190);
        // context.fillStyle = '#000000'
        // context.fill()
    }, [board, isFlipped, ultimateStates.isSkillTargetSelecting])


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


    const drawEffects = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        if (!isUltimate) return;
        (board.cells as ICellUlt[][]).forEach(row => row.forEach(cell => cell.updateEffect(ctx, canvas, isFlipped)));
    }, [isUltimate, board])

    const drawMouseOver = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {

        if (!ultimateStates.isSkillTargetSelecting) return;
        cells.forEach(row => {
            return row.forEach(cell => {

                if (!cell.isMouseOver) return;
                const { w, h } = getCellSize(canvas);
                const { x, y } = _getCellPosFromCoord(cell.x, cell.y)
                const fill = COLORS.CELL.selected;
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

    }, [ultimateStates.isSkillTargetSelecting])


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


    const _getCellPosFromMouse = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
        const { x, y } = _getPosWithinBoard(e);
        if (isFlipped) return getFlippedPos(x, y);
        return { x: Math.floor(x), y: Math.floor(y) };
    }, [isFlipped, ultimateStates.isSkillTargetSelecting])

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

    const _setCellMouseOver = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
        const { x, y } = _getCellPosFromMouse(e);
        const target = cells[y][x]

        if (prevMouseOver.current && prevMouseOver.current !== target) prevMouseOver.current.isMouseOver = false;

        target.isMouseOver = true;
        prevMouseOver.current = target;

    }, [ultimateStates.isSkillTargetSelecting])

    const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        e.preventDefault()

        if (ultimateStates.isSkillTargetSelecting) _setCellMouseOver(e);

        if (!isDragging) return;
        _setPieceToMouse(e);
    }, [isDragging, cells.length, ultimateStates.isSkillTargetSelecting])

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
        onCellSelect(target)
    }, [isDragging, cells.length, selected, ultimateStates.isSkillTargetSelecting])


    const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        if (ultimateStates.isSkillTargetSelecting) return; // only mouseDown handles skill target selection

        e.preventDefault()

        if (!draggingPiece.current || !dragStartCell.current) return;
        const { x, y } = _getCellPosFromMouse(e);
        const target = cells[y][x];
        if (dragStartCell.current !== target) {
            clearDragging()
            onCellSelect(target);
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
        setIsDragging(prev => false);
    }, [isDragging])

    return {

        canvas: {
            draw,
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