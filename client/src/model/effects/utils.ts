import { IBoardUlt } from "../ultimate/BoardUlt";
import { ICellUlt } from "../ultimate/CellUlt";
import { effectList } from "./data/effects.data";



//Based on what skill is applied on  a figure or a cell we create a VFX. Skill and VFX names are the same

export const setEffectsOnBoard = (board: IBoardUlt) => {
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
}

