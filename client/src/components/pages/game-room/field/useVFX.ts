import { useCallback, useEffect, useState } from "react";
import { effectList, EffectNames } from "../../../../model/effects/data/effects.data";
import { IVFX, VFX } from "../../../../model/effects/VFX";
import { IBoardUlt } from "../../../../model/ultimate/BoardUlt";
import { ICellUlt } from "../../../../model/ultimate/CellUlt";


export interface IUseVFX {
    board: IBoardUlt;
    isUltimate: boolean;
    isFlipped: boolean;
}

export const useVFX = ({ board, isUltimate, isFlipped }: IUseVFX) => {

    const [vfx, setVfx] = useState<IVFX[]>([])


    const _getEffectFromLastMove = useCallback(() => {

        const effects: IVFX[] = []
        const lastMove = board.states.moves[board.states.moves.length - 1];

        if (lastMove && lastMove.moveMadeAt === board.states.globalMovesCount) {
            let effectItem = effectList.find(effect => effect.title === EffectNames.ON_MOVE);
            if (lastMove.options.isCastling) effectItem = effectList.find(effect => effect.title === EffectNames.ON_CASTLE);
            const effect = new VFX({
                ...effectItem!,
                position: {
                    x: lastMove.to.x,
                    y: lastMove.to.y,
                }
            })
            isFlipped && effect.flipPosition()
            effects.push(effect);
        }

        return effects;


    }, [board.states.globalMovesCount, board.states.moves.length])

    const _getEffectFromLastSkill = useCallback(() => {
       
        if (!board.states.skillsUsed) return [];        
        const effects: IVFX[] = []
        const lastUsedSkill = board.states.skillsUsed[board.states.skillsUsed.length - 1];

        if (!lastUsedSkill) return [];
        if (!lastUsedSkill.lasts && lastUsedSkill.appliedAt === board.states.globalMovesCount) {
            const effectItem = effectList.find(effect => effect.title === lastUsedSkill.title);

            const effect = new VFX({
                ...effectItem!,
                position: {
                    x: lastUsedSkill.target.x,
                    y: lastUsedSkill.target.y
                }
            })
            isFlipped && effect.flipPosition()
            effects.push(effect);
        }

        return effects;

    }, [board.states.globalMovesCount])

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
    }, [board.states.globalMovesCount])


    useEffect(() => {
        if (!isUltimate) return;
        const newEffects = [..._getEffectsOnCells(), ..._getEffectFromLastMove(), ..._getEffectFromLastSkill()]

        setVfx(newEffects);

    }, [board.states.globalMovesCount, isUltimate])


    return {
        vfx,
    }
}