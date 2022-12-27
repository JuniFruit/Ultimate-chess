import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { IMove } from "../../../../constants/socketIO/ClientEvents.interface";
import { useActions } from "../../../../hooks/useActions";
import { IBoard } from "../../../../model/Board";
import { Colors } from "../../../../model/colors.enum";
import { IBoardUlt } from "../../../../model/ultimate/BoardUlt";
import { ICellUlt } from "../../../../model/ultimate/CellUlt";
import { ISkillItem, SkillErrorMsg } from "../../../../model/ultimate/Skills";
import { useIOField } from "./useIOField";


interface IUseUltimate {
    board: IBoardUlt;
    isObserver: boolean;
    myColor: Colors;
    setBoard: Dispatch<SetStateAction<IBoard | IBoardUlt>>
    setIsSkillBookOpen: Dispatch<SetStateAction<boolean>>
    handleSendMove: (move: IMove) => void;
    // handleReceiveMove: (move:IMove) => void;
}


export const useUltimate = ({
    board,
    isObserver,
    myColor,
    setBoard,
    setIsSkillBookOpen,
    handleSendMove
}: IUseUltimate) => {

    const chosenSkill = useRef<ISkillItem | null>(null);
    const [isSkillTargetSelecting, setIsSkillTargetSelecting] = useState(false);
    const { addMsg } = useActions()

    const handleSetChosenSkill = useCallback((skill: ISkillItem) => {
        if (board.states.isFirstMove) {
            addMsg({ message: SkillErrorMsg.INVALID_STATE, status: 500 })
            return _handleClearStates();
        }
        if (board.states.currentPlayer !== myColor) {
            addMsg({ message: SkillErrorMsg.NOT_YOUR_TURN, status: 500 })
            return _handleClearStates()
        }
        if (chosenSkill.current?.title === skill.title) return _handleClearStates();
        chosenSkill.current = skill;
        setIsSkillTargetSelecting(prev => true);
        setIsSkillBookOpen(prev => false);

    }, [isSkillTargetSelecting, board.states.currentPlayer, board.states.isFirstMove, myColor])

    const _handleClearStates = useCallback(() => {
        chosenSkill.current = null
        setIsSkillBookOpen(prev => false);
        setIsSkillTargetSelecting(prev => false)
    }, [])

    const handlePerformSkill = useCallback((cell: ICellUlt) => {
        if (board.states.isGameOver) return _handleClearStates();
        if (!chosenSkill.current || !cell.canPerformSkill(chosenSkill.current.title, board)) {
            addMsg({ message: SkillErrorMsg.INVALID_TARGET, status: 500 })
            return _handleClearStates();
        }
        if (board.states.isCheck) {
            addMsg({ message: SkillErrorMsg.IN_CHECK, status: 500 })
            return _handleClearStates()
        }

        board.incrementMoveCount();
        cell.performSkill(chosenSkill.current.title, board);
        board.swapPlayer();
        handleSendSkillMove(cell, chosenSkill.current);

        _handleClearStates();
        setBoard(prev => prev.getCopyBoard())

    }, [board])

    const handleSendSkillMove = useCallback((to: ICellUlt, skill: ISkillItem) => {

        const move: IMove = {
            from: {
                x: 0,
                y: 0,
                pos: 'none'
            },
            to: {
                x: to.x,
                y: to.y,
                pos: to.pos
            },
            options: { skill: skill.title }
        }
        handleSendMove(move);
    }, [])


    return {
        ultHandlers: {
            handlePerformSkill,
            handleSetChosenSkill
        },
        ultStatus: {
            isSkillTargetSelecting
        }
    }

}