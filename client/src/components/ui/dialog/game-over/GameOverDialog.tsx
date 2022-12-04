import { FC, useState } from 'react'
import { Dialog } from '@headlessui/react'
import styles from '../waiting/WaitingDialog.module.scss';
import { IDialog } from '../Dialog.interface';
import { Button } from '../../button/Button';
import { mockups } from '../../../../assets/mockups/images';

const GameOverDialog: FC<IDialog> = ({ message, onDialog, isOpen, onClose }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className={styles.container}
        >
            <div className={styles.wrapper}>
                <Dialog.Panel className={styles.panel_wrapper}>
                    <Dialog.Title className={styles.panel_title}>Match results</Dialog.Title>
                    <p className={styles.panel_msg}>
                        {message}
                    </p>
                    <img src={mockups.waitingGIF} />
                    <div className={styles.panel_buttons}>
                        <Button onClick={onDialog}>Rematch</Button>
                        <Button onClick={onClose}>Main menu</Button>
                    </div>

                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

export default GameOverDialog;