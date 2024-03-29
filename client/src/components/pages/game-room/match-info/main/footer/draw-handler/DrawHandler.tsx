import { FC, useContext, memo } from 'react';
import { IoCheckmarkOutline, IoCloseOutline } from 'react-icons/io5';
import { AudioCtx } from '../../../../../../../audio-engine/audio.provider';
import { AudioContextType } from '../../../../../../../audio-engine/audio.types';
import { Button } from '../../../../../../ui/button/Button';

import styles from '../Handle.module.scss';
import { IDrawHandler } from './DrawHandler.interface';

const DrawHandler: FC<IDrawHandler> = memo(({ onConfirm, onDecline }) => {

    const { playSound } = useContext(AudioCtx) as AudioContextType;

    playSound('drawRequest');

    return (
        <div className={styles.handler_wrapper}>
            <h4>Your opponent is offering a draw. Accept?</h4>
            <div className={styles.buttons}>
                <Button
                    onClick={onConfirm}
                    aria-label={'confirm request'}
                >
                    <IoCheckmarkOutline />
                </Button>
                <Button onClick={onDecline}
                    aria-label={'decline request'}
                >
                    <IoCloseOutline />
                </Button>
            </div>
        </div>
    )
})

export default DrawHandler