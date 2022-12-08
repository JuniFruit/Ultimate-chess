import { FC, useState } from 'react'
import { Dialog } from '@headlessui/react'
import styles from '../Dialog.module.scss';
import { IDialog } from '../Dialog.interface';
import { Button } from '../../button/Button';
import { mockups } from '../../../../assets/mockups/images';
import { useActions } from '../../../../hooks/useActions';

const GameOverDialog: FC<IDialog> = ({ message, onDialog, isOpen, onClose }) => {

    const {addMsg} = useActions()
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

                    </Dialog.Description>
                    <img src={mockups.waitingGIF} />
                    
                    <div className={styles.panel_buttons}>
                        <Button onClick={() => { onDialog(); addMsg({message: 'Request sent',status:200}) }}>Rematch</Button>
                        <Button onClick={onClose}>Main menu</Button>
                    </div>

                </Dialog.Panel>
            </div>
        </Dialog >
    )
}

export default GameOverDialog;