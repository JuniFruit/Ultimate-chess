import { FC } from 'react';
import { Button } from '../../../../../ui/button/Button';
import { IDrawHandler } from './DrawHandler.interface';
import styles from './Draw.module.scss';
import { IoCheckmarkOutline, IoCloseOutline } from 'react-icons/io5';

export const DrawHandler: FC<IDrawHandler> = ({onConfirm, onDecline}) => {

    return (
        <div className={styles.handler_wrapper}>
            <h4>Your opponent is requesting a draw. Accept?</h4>
            <div className={styles.buttons}>
                <Button onClick={onConfirm}>
                    <IoCheckmarkOutline />
                </Button>
                <Button onClick={onDecline}>
                    <IoCloseOutline />
                </Button>   
            </div>
        </div>
    )
}