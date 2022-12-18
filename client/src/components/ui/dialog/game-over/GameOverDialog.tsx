import { FC, useState } from 'react'
import { Dialog } from '@headlessui/react'
import styles from '../Dialog.module.scss';
import { IDialog } from '../Dialog.interface';
import { Button } from '../../button/Button';
import { useActions } from '../../../../hooks/useActions';
import { GameOverReasons } from '../../../../model/helper.enum';
import { iconsGeneral } from '../../../../assets/icons/general/iconsGeneral';

interface IGameOverDialog extends IDialog {
    isObserver: boolean;
    reason?: GameOverReasons;
}

const GameOverDialog: FC<IGameOverDialog> = ({ message, onDialog, isOpen, onClose, isObserver, reason }) => {

    const { addMsg } = useActions()

    const handleOnClick = () => {
        if (isObserver) return;
        onDialog();
        addMsg({ message: 'Request sent', status: 200 })
    }

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className={styles.container}
        >
            <div className={styles.wrapper}>
                <Dialog.Panel className={styles.panel_wrapper}>
                    <Dialog.Title className={styles.panel_title}>Match results</Dialog.Title>
                    <Dialog.Description className={styles.panel_msg}>
                        {message}
                        {reason && <span>{`By ${reason}`}</span>}
                    </Dialog.Description>

                    <img
                        src={`${reason === GameOverReasons.TIMEOUT ? iconsGeneral.timer : iconsGeneral.gameOverKing}`}
                        alt="game-over icon"
                    />

                    <div className={styles.panel_buttons}>
                        <Button onClick={handleOnClick} disabled={isObserver}>{`${isObserver ? 'Waiting for players' : 'Rematch'}`}</Button>
                        <Button onClick={onClose}>Main menu</Button>
                    </div>

                </Dialog.Panel>
            </div>
        </Dialog >
    )
}

export default GameOverDialog;