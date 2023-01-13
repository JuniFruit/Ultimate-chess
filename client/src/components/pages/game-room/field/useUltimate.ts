import { Dispatch, SetStateAction, useCallback, useContext, useRef, useState } from "react";
import { AudioCtx } from "../../../../audio-engine/audio.provider";
import { AudioContextType } from "../../../../audio-engine/audio.types";
import { IMove } from "../../../../constants/socketIO/ClientEvents.interface";
import { useActions } from "../../../../hooks/useActions";
import { Colors } from "../../../../model/colors.enum";
import { IBoardUlt } from "../../../../model/ultimate/BoardUlt";
import { ICellUlt } from "../../../../model/ultimate/CellUlt";
import { ISkillItem, SkillErrorMsg } from "../../../../model/ultimate/Skills";


interface IUseUltimate {
    board: IBoardUlt;
    isObserver: boolean;
    myColor: Colors;
    setIsSkillBookOpen: Dispatch<SetStateAction<boolean>>
    handleSendMove: (move: IMove) => void;
}


export const useUltimate = ({
    board,
    myColor,
    setIsSkillBookOpen,
    handleSendMove
}: IUseUltimate) => {

    const chosenSkill = useRef<ISkillItem | null>(null);
    const [isSkillTargetSelecting, setIsSkillTargetSelecting] = useState(false);
    const { addMsg } = useActions()
    const {playSound} = useContext(AudioCtx) as AudioContextType

    const handleSetChosenSkill = (skill: ISkillItem) => {
        if (board.states.isFirstMove) {
            _setInvalid(SkillErrorMsg.INVALID_STATE);
            return _handleClearStates();
        }
        if (board.states.currentPlayer !== myColor) {
            _setInvalid(SkillErrorMsg.NOT_YOUR_TURN)
            return _handleClearStates()
        }
        if (chosenSkill.current?.title === skill.title) return _handleClearStates();
        chosenSkill.current = skill;
        setIsSkillTargetSelecting(prev => true);
        setIsSkillBookOpen(prev => false);

    }

    const _handleClearStates = useCallback(() => {
        chosenSkill.current = null
        setIsSkillBookOpen(prev => false);
        setIsSkillTargetSelecting(prev => false)
    }, [])

    const _setInvalid = useCallback((msg: SkillErrorMsg) => {
        addMsg({ message: msg, status: 500 });
        playSound('invalid');
    }, [])

    const handlePerformSkill = (cell: ICellUlt) => {
       

        if (board.states.isGameOver) return _handleClearStates();
        if (!chosenSkill.current || !cell.canPerformSkill(chosenSkill.current, board)) {
            _setInvalid(SkillErrorMsg.INVALID_TARGET)
            return _handleClearStates();
        }
        if (board.isKingChecked()) {
            _setInvalid(SkillErrorMsg.IN_CHECK)
            return _handleClearStates()
        }

        board.incrementMoveCount();
        board.addUsedSkill(chosenSkill.current.title, cell);
        cell.performSkill(chosenSkill.current.title, board);
        board.swapPlayer();
        handleSendSkillMove(cell, chosenSkill.current);

        _handleClearStates();

    }

    const handleSendSkillMove = (to: ICellUlt, skill: ISkillItem) => {

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
    }


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