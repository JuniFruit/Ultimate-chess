import { useCallback, useContext } from 'react';
import { AudioCtx } from '../../../../audio-engine/audio.provider';
import { AudioContextType } from '../../../../audio-engine/audio.types';
import { IMove } from '../../../../constants/socketIO/ClientEvents.interface';


export const useSound = () => {

    const { playSound } = useContext(AudioCtx) as AudioContextType;

    const handleMoveSound = useCallback((move: IMove) => {

        if (move.options?.isCastling) return playSound('castle');
        if (move.options?.isPromotion) return playSound('promotion', 3);
        if (move.options?.isTake) return playSound('take');
        if (move.options?.skill) return playSound(move.options.skill, 4);     
        return playSound('move');
        
    }, []) 

   

    return {
        handleMoveSound
    }
}