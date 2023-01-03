import { ICanvasField } from "./CanvasField.interface";
import { useCallback, useRef } from 'react';
import { Colors } from "../../../../../model/colors.enum";
import { getFlippedPos } from "../../../../../model/helpers";
import { drawCircle, drawRect, getCellSize } from "./utils/canvas.utils";
import { COLORS } from "./utils/colors.utils";
import { ICellUlt } from "../../../../../model/ultimate/CellUlt";
import { IBoardUlt } from "../../../../../model/ultimate/BoardUlt";
import { setEffectsOnBoard } from "../../../../../model/effects/utils";
import { useHandleMoves } from "./useHandleMoves";

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

    const {handlers} = useHandleMoves({cells,onCellSelect,selected,isFlipped,ultimateStates})
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


    const _getCellPosFromCoord = useCallback((x: number, y: number) => {
        if (isFlipped) return getFlippedPos(x, y);
        return { x, y }
    }, [isFlipped])

    

    return {

        canvas: {
            draw,
            handlePreDraw,
        },
        handlers
    }


}