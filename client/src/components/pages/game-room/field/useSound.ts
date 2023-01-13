import { useCallback, useContext, useEffect } from 'react';
import { AudioCtx } from '../../../../audio-engine/audio.provider';
import { AudioContextType } from '../../../../audio-engine/audio.types';
import { IBoard } from '../../../../model/Board';
import { IBoardUlt } from '../../../../model/ultimate/BoardUlt';


export const useSound = (board: IBoard | IBoardUlt) => {

    const { playSound, playAnnounce } = useContext(AudioCtx) as AudioContextType;


    const _handleMoveSFX = useCallback(() => {

        const lastMove = board.states.moves[board.states.moves.length - 1]
        if (lastMove && lastMove.moveMadeAt === board.states.globalMovesCount) {
            if (lastMove.options?.isCastling) return playSound('castle');
            if (lastMove.options?.isPromotion) return playSound('promotion', 3);
            if (lastMove.options?.isTake) return playSound('take');
            return playSound('move');

        }

    }, [board.states.globalMovesCount])

    const _handleSkillSFX = useCallback(() => {
        if (!(board as IBoardUlt).states.skillsUsed) return;
        const lastSkill = (board as IBoardUlt).states.skillsUsed[(board as IBoardUlt).states.skillsUsed.length - 1];

        if (lastSkill && lastSkill.appliedAt === board.states.globalMovesCount) {
            playSound(lastSkill.title, 4);
        }

    }, [board.states.globalMovesCount])

    useEffect(() => {
        if (board.states.isGameOver) playAnnounce('gameOver');
        if (board.isKingChecked()) playSound('check');
        _handleMoveSFX();
        _handleSkillSFX();
    }, [board.states.globalMovesCount, board.states.isGameOver])
}