import { useCallback, useRef } from 'react';
import { Colors } from "../../../../../model/colors.enum";
import { effectList } from "../../../../../model/effects/data/effects.data";
import { VFX } from "../../../../../model/effects/VFX";
import { getFlippedPos } from "../../../../../model/helpers";
import { Positions } from '../../../../../model/positions';
import { SkillNames } from "../../../../../model/ultimate/Skills";
import { ICanvasField } from "./CanvasField.interface";
import { useHandleMoves } from "./useHandleMoves";
import { drawCircle, drawCoord, drawRect, getCellSize } from "./utils/canvas.utils";
import { COLORS } from "./utils/colors.utils";

export const useCanvasField = (
    {
        cells,
        board,
        onCellSelect,
        premoves,
        isFlipped,
        selected,
        ultimateStates,
        isUltimate,
        vfx

    }: ICanvasField) => {

    const { handlers } = useHandleMoves({ cells, onCellSelect, selected, isFlipped, ultimateStates, premoves })
    const prevMoveCount = useRef<number>(board.states.globalMovesCount);

    const handlePreDraw = useCallback((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        _setFigureAnimation(canvas);
        if (prevMoveCount.current !== board.states.globalMovesCount) _setFigureEffects(canvas)
        _drawBoard(context, canvas);
        _drawPremoves(context, canvas);
        _drawAvailable(context, canvas);
        _drawSelected(context, canvas);

        prevMoveCount.current = board.states.globalMovesCount;

    }, [isFlipped, premoves.length, selected, board, isUltimate])


    const draw = useCallback((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frameCount: number) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        _drawMouseOver(context, canvas)
        _drawFigures(context, canvas)
        _drawEffects(context, canvas);

    }, [board, isFlipped, ultimateStates.isSkillTargetSelecting, vfx])





    const _setFigureAnimation = useCallback((canvas: HTMLCanvasElement) => {
        board.figures.forEach(figure => {
            const animation = new VFX({
                sprite: figure.spriteSrc!,
                framesMaxWidth: figure.sprites?.frames!,
                position: {
                    x: figure.x,
                    y: figure.y
                },
                title: SkillNames.INCINERATE, // Any
                isLooped: true
            });

            figure.setAnimation(animation);
            

        })
    }, [board, isFlipped])

    const _setFigureEffects = useCallback((canvas: HTMLCanvasElement) => {

        board.figures.forEach(figure => {
            if (figure.ultimateStates.skillsApplied.length) {
                figure.ultimateStates.effects = []; // clear before add 
                figure.ultimateStates.skillsApplied.forEach(skill => {
                    const effectItem = effectList.find(item => item.title === skill.title);
                    const skillEffect = new VFX({
                        ...effectItem!,
                        position: {
                            x: figure.x,
                            y: figure.y
                        }
                    })
                    figure.setEffect(skillEffect);
                    
                })
            }
        })

    }, [board, isFlipped])


    const _drawFigures = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {

        board.figures.forEach((figure) => {
            figure.draw(ctx, canvas, isFlipped);
            figure.drawEffect(ctx, canvas, isFlipped)
        })

    }, [board, isFlipped])

    const _drawPremoves = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
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

    const _drawAvailable = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {

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

    const _drawSelected = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
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


    const _drawEffects = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        if (!isUltimate) return;
        vfx.forEach(effect => {
            effect.scaleToCellSize(canvas);
            effect.rescaleAndCenter();
            effect.updateVFX(ctx)
        })
    }, [isUltimate, board, vfx])

    const _drawMouseOver = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {

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


    const _drawBoard = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
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

                if (x === 0) drawCoord(
                    ctx,
                    `${isFlipped ? y + 1 : 7 - y + 1}`,
                    {
                        x: x + 2,
                        y: y * h + h / 4
                    },
                    w / 4,
                    cell.color === Colors.BLACK ? COLORS.CELL.white : COLORS.CELL.black
                );

                if (y === 7) drawCoord(
                    ctx,
                    `${isFlipped ? Positions[7 - x] : Positions[x]}`,
                    {
                        x: x * w + w / 1.2,
                        y: y * h + h - 5
                    },
                    w / 4,
                    cell.color === Colors.BLACK ? COLORS.CELL.white : COLORS.CELL.black
                );

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