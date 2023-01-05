import { ICanvasField } from "./CanvasField.interface";
import { useCallback, useRef } from 'react';
import { Colors } from "../../../../../model/colors.enum";
import { getFlippedPos } from "../../../../../model/helpers";
import { drawCircle, drawRect, getCellSize } from "./utils/canvas.utils";
import { COLORS } from "./utils/colors.utils";
import { useHandleMoves } from "./useHandleMoves";
import { VFX } from "../../../../../model/effects/VFX";
import { SkillNames } from "../../../../../model/ultimate/Skills";
import { effectList } from "../../../../../model/effects/data/effects.data";

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
        
        _setFigureAnimationAndEffects(canvas);
        _drawBoard(context, canvas);
        _drawPremoves(context, canvas);
        _drawAvailable(context, canvas);
        _drawSelected(context, canvas);

        prevMoveCount.current = board.states.globalMovesCount;

    }, [isFlipped, premoves.length, selected, board, isUltimate])


    const draw = useCallback((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frameCount: number) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        _drawMouseOver(context, canvas)
        _drawFigures(context)
        _drawEffects(context, canvas);

    }, [board, isFlipped, ultimateStates.isSkillTargetSelecting, vfx])


    const _setFigureAnimationAndEffects = useCallback((canvas: HTMLCanvasElement) => {
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
            animation.scaleToCellSize(canvas);
            animation.rescaleAndCenter()
            isFlipped && animation.flipPosition();
            figure.setAnimation(animation);

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
                    skillEffect.scaleToCellSize(canvas);
                    skillEffect.rescaleAndCenter()
                    isFlipped && skillEffect.flipPosition();
                    figure.setEffect(skillEffect);
                })
            }

        })
    }, [board, isFlipped])


    const _drawFigures = useCallback((ctx: CanvasRenderingContext2D) => {

        board.figures.forEach((figure) => {
            figure.draw(ctx, isFlipped);
            figure.drawEffect(ctx, isFlipped)
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