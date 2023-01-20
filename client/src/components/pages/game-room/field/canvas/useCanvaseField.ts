import { useCallback, useEffect } from 'react';
import { Colors } from "../../../../../model/colors.enum";
import { effectList, EffectNames } from "../../../../../model/effects/data/effects.data";
import { VFX } from "../../../../../model/effects/VFX";
import { getFlippedPos } from "../../../../../model/helpers";
import { Positions } from '../../../../../model/positions';
import { setFigureAnimation } from '../../../../../utils/game.utils';
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
        vfx,
        

    }: ICanvasField) => {

    const { handlers, status } = useHandleMoves({ cells, onCellSelect, selected, isFlipped, ultimateStates, premoves })




    const _setFigureEffects = useCallback(() => {

        board.figures.forEach(figure => {
            if (figure.ultimateStates.skillsApplied.length) {
                figure.effects = []; // clear before add 
                figure.ultimateStates.skillsApplied.forEach(skill => {
                    let effectItem = effectList.find(item => item.title === skill.title);
                    if (!effectItem) effectItem = effectList.find(item => item.title === EffectNames.DEFAULT)
                    const skillEffect = new VFX({
                        ...effectItem!,
                        position: {
                            x: figure.animation!.position.x,
                            y: figure.animation!.position.y
                        }
                    })
                    if (isFlipped) skillEffect.flipPosition();
                    figure.effects.push(skillEffect);
                })
            }
        })

    }, [board, isFlipped])


    const _drawFigures = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        board.figures.forEach((figure) => {

            if (figure.animation) {
                figure.animation.scaleToCellSize(canvas);
                figure.animation.rescaleAndCenter()
                figure.animation.updateVFX(ctx);

                if (figure.effects.length) {
                    figure.effects.forEach(effect => {
                        effect.updatePosition(figure.animation!.position.x, figure.animation!.position.y);
                        effect.scaleToCellSize(canvas);
                        effect.rescaleAndCenter()
                        effect.updateVFX(ctx);
                    })
                }
            }
        })

    }, [board])

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

    const _drawLastMove = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {

        const lastMove = board.states.moves[board.states.moves.length - 1];
        if (!lastMove) return;
        const { w, h } = getCellSize(canvas)
        const { x: initX, y: initY } = _getCellPosFromCoord(lastMove.from.x, lastMove.from.y);
        const { x: targetX, y: targetY } = _getCellPosFromCoord(lastMove.to.x, lastMove.to.y);
        const args = {
            ctx,
            width: w,
            height: h,
        }
        drawRect({ ...args, x: initX * w, y: initY * h, fill: COLORS.CELL.lastMoveFrom });
        drawRect({ ...args, x: targetX * w, y: targetY * h, fill: COLORS.CELL.lastMoveTo });

    }, [board.states.moves.length])

    const _drawMovement = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {

        board.figures.forEach(figure => {
            if (status.draggingPiece === figure) return;
            figure.animation?.moveEffect({
                x: isFlipped ? 7 - figure.x : figure.x,
                y: isFlipped ? 7 - figure.y : figure.y
            });

        })

    }, [board.states.globalMovesCount, status.draggingPiece])

    const _drawAvailable = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {

        cells.forEach(row => {
            row.forEach(cell => {
                const available = selected?.figure?.legalMoves.find(move => move.pos === cell.pos)
                if (available) {
                    const { w, h } = getCellSize(canvas)
                    const { x, y } = _getCellPosFromCoord(cell.x, cell.y)
                    const args = {
                        ctx,
                        x: (x * w) + w / 2,
                        y: (y * h) + h / 2,
                        fill: COLORS.CELL.available,
                        stroke: "#44403c00"
                    }
                    drawCircle({ ...args, radius: w / 6 });

                    if (available.figure) drawCircle({
                        ...args, radius: w / 2, strokeWidth: 2
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

    const _drawCoordinates = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {

        cells.forEach((row, y) => {
            return row.forEach((cell, x) => {
                const { w, h } = getCellSize(canvas);

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
    }, [_drawBoard])


    const _getCellPosFromCoord = useCallback((x: number, y: number) => {
        if (isFlipped) return getFlippedPos(x, y);
        return { x, y }
    }, [isFlipped])


    const handlePreDraw = useCallback((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        _drawBoard(context, canvas);
        _drawLastMove(context, canvas);
        _drawPremoves(context, canvas);
        _drawAvailable(context, canvas);
        _drawSelected(context, canvas);
        _drawCoordinates(context, canvas);
    }, [_drawBoard, _drawPremoves, _drawAvailable, _drawSelected, _drawLastMove])


    const draw = useCallback((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frameCount: number) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        _drawMouseOver(context, canvas)
        _drawFigures(context, canvas);
        _drawMovement(context, canvas);
        _drawEffects(context, canvas);

    }, [_drawMouseOver, _drawFigures, _drawEffects, _drawMovement])

    useEffect(() => {

        setFigureAnimation(board, isFlipped);

    }, [board.states.moves[board.states.moves.length - 1]?.options?.isPromotion])

    useEffect(() => {

        _setFigureEffects()

    }, [_setFigureEffects])

    return {

        canvas: {
            draw,
            handlePreDraw,
        },
        handlers
    }


}