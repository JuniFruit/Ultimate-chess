import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { IBoard } from "../../../model/Board"
import { Colors } from "../../../model/colors.enum";
import { IBoardUlt } from "../../../model/ultimate/BoardUlt"
import { ICellUlt } from "../../../model/ultimate/CellUlt";


interface IUseUltimate {
    board: IBoard | IBoardUlt;
    isObserver: boolean;
    myColor: Colors;
    setBoard: Dispatch<SetStateAction<IBoard | IBoardUlt>>

}


export const useUltimate = ({ board, isObserver, myColor, setBoard }: IUseUltimate) => {

    const [isSkillBookOpen, setIsSkillBookOpen] = useState(false);
    const chosenSkill = useRef<string | null>(null);
    const [isSkillTargetSelecting, setIsSkillTargetSelecting] = useState(false);


    const handleToggleSkillBook = useCallback(() => {
        setIsSkillBookOpen(prev => !prev);
    }, [isSkillBookOpen])

    const handleSetChosenSkill = useCallback((skill: string) => {
        chosenSkill.current = skill;
        setIsSkillTargetSelecting(prev => !prev);
        setIsSkillBookOpen(prev => !prev);
    }, [isSkillTargetSelecting])


    const handlePerformSkill = useCallback((cell: ICellUlt) => {
        cell.performSkill(chosenSkill.current!, cell, board);
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