import { useCallback, useContext } from 'react';
import { AudioCtx } from '../../../../audio-engine/audio.provider';
import { AudioContextType } from '../../../../audio-engine/audio.types';
import { IMove } from '../../../../constants/socketIO/ClientEvents.interface';


export const useMoveSound = () => {

    const { playSound } = useContext(AudioCtx) as AudioContextType;

    const handleMoveSound = (move: IMove) => {

        if (move.options?.isCastling) return playSound('castle');
        if (move.options?.isPromotion) return playSound('promotion');
        if (move.options?.isTake) return playSound('take');
        return playSound('move');
    }


    return {
        handleMoveSound
    }
}