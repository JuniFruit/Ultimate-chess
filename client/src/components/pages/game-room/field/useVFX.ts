import { useCallback, useEffect, useRef, useState } from "react";
import { IMove } from "../../../../constants/socketIO/ClientEvents.interface";
import { effectList, EffectNames } from "../../../../model/effects/data/effects.data";
import { IVFX, VFX } from "../../../../model/effects/VFX";
import { IBoardUlt } from "../../../../model/ultimate/BoardUlt"
import { ICellUlt } from "../../../../model/ultimate/CellUlt";
import { SkillList } from "../../../../model/ultimate/Skills";


export interface IUseVFX {
    board: IBoardUlt;
    isUltimate: boolean;
    isFlipped: boolean;
}



export const useVFX = ({ board, isUltimate, isFlipped }: IUseVFX) => {

    const [vfx, setVfx] = useState<IVFX[]>([])
    const lastMove = useRef<IMove | null>(null)

    const handleAddEffectFromMove = useCallback((move: IMove) => {
        
        lastMove.current = null;
        if (move.options?.skill) {
            lastMove.current = move;
            return
        }
        lastMove.current = move;

    }, [])

    const _getEffectFromLastMove = useCallback(() => {
        if (!lastMove.current) return;
        const position = {
            x: lastMove.current.to.x,
            y: lastMove.current.to.y
        }

        let effect: IVFX;
        if (lastMove.current.options?.skill) {
            const effectItem = effectList.find(effect => effect.title === lastMove.current!.options?.skill);
            const isNotInstant = SkillList.find(item => item.title === effectItem?.title)?.lasts;
            if (isNotInstant) return;
            if (vfx.find(item => item.title === effectItem?.title)) return;
            effect = new VFX({
                ...effectItem!,
                position
            })
            isFlipped && effect.flipPosition();
        } else {
            const effectItem = effectList.find(effect => effect.title === EffectNames.ON_MOVE);
            effect = new VFX({
                ...effectItem!,
                position
            })
        }
        isFlipped && effect.flipPosition()

        return effect;


    }, [board, vfx])

    const _getEffectsOnCells = useCallback(() => {
        const result: IVFX[] = [];

        (board.cells as ICellUlt[][]).forEach((row) => {
            row.forEach((cell) => {
                cell.states.skillsApplied.forEach(skill => {
                    const effectItem = effectList.find(effect => effect.title === skill.title);
                    const vfx = new VFX({
                        ...effectItem!,
                        position: {
                            x: cell.x,
                            y: cell.y
                        }
                    });
                    isFlipped && vfx.flipPosition();
                    result.push(vfx)
                })
            })
        })

        return result;
    }, [board, isUltimate])


    useEffect(() => {
        if (!isUltimate) return;

        setVfx(prev => {
            const newArr = []
            newArr.push(..._getEffectsOnCells());
            const effect = _getEffectFromLastMove();
            if (effect) newArr.push(effect);
            return newArr
        });

    }, [board.states.globalMovesCount])


    return {
        vfx,
        handleAddEffectFromMove,
    }
}