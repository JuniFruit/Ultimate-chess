import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { IBoard } from "../../../model/Board"
import { Colors } from "../../../model/colors.enum";
import { IBoardUlt } from "../../../model/ultimate/BoardUlt"
import { ICellUlt } from "../../../model/ultimate/CellUlt";
import { SkillNames } from "../../../model/ultimate/Skills";


interface IUseUltimate {
    board: IBoardUlt;
    isObserver: boolean;
    myColor: Colors;
    setBoard: Dispatch<SetStateAction<IBoard | IBoardUlt>>

}


export const useUltimate = ({ board, isObserver, myColor, setBoard }: IUseUltimate) => {

    const [isSkillBookOpen, setIsSkillBookOpen] = useState(false);
    const chosenSkill = useRef<SkillNames | null>(null);
    const [isSkillTargetSelecting, setIsSkillTargetSelecting] = useState(false);


    const handleToggleSkillBook = useCallback(() => {
        setIsSkillBookOpen(prev => !prev);
    }, [isSkillBookOpen])

    const handleSetChosenSkill = useCallback((skill: SkillNames) => {
        chosenSkill.current = skill;
        setIsSkillTargetSelecting(prev => !prev);
        setIsSkillBookOpen(prev => !prev);
    }, [isSkillTargetSelecting])


    const handlePerformSkill = useCallback((cell: ICellUlt) => {
        if (!chosenSkill.current) return;
        if (!cell.canPerformSkill(chosenSkill.current, board)) return;
        cell.performSkill(chosenSkill.current, board);
    }, [board])



    return {
        ultHandlers: {
            handleToggleSkillBook,
            handlePerformSkill,
            handleSetChosenSkill
        },
        ultStatus: {
            isSkillBookOpen,
            isSkillTargetSelecting
        }
    }

}