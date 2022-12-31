import { useCallback, useState } from "react";
import { effectList } from "../../../../model/effects/data/effects.data";
import { IVFX } from "../../../../model/effects/VFX";
import { IBoardUlt } from "../../../../model/ultimate/BoardUlt"
import { ICellUlt } from "../../../../model/ultimate/CellUlt";


export interface IUseVFX {
    board: IBoardUlt;
    isUltimate: boolean
}

export interface IVFXArrayItem {
    vfx: IVFX;
    posX: number;
    posY: number;
}

export const useVFX = ({board, isUltimate}: IUseVFX) => {

    const [vfx, setVfx] = useState([])

    const setVfxFromCells = useCallback(() => {

        const result = [];

        (board.cells as ICellUlt[][]).forEach(row => {
            row.forEach(cell => {
                cell.clearEffects()
                cell.states.skillsApplied.forEach(skill => {
                    const effectItem = effectList.find(effect => effect.title === skill.title);
                    cell.setEffect(effectItem!)
                })
                if (cell.figure) {
                    cell.figure.clearEffects();
                    cell.figure.ultimateStates.skillsApplied.forEach(skill => {
                        const effectItem = effectList.find(effect => effect.title === skill.title)
                        cell.figure!.setEffect(effectItem!)
                    })
                }
            })
        })

    }, [board.states.globalMovesCount])
}