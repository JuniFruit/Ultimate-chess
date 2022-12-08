import { FC, useState } from 'react'
import { Dialog } from '@headlessui/react'
import styles from '../Dialog.module.scss';
import { IDialog } from '../Dialog.interface';
import { Button } from '../../button/Button';
import { mockups } from '../../../../assets/mockups/images';

const WaitingDialog: FC<IDialog> = ({ message, onDialog, isOpen, onClose }) => {
    const [isCopied, setIsCopied] = useState(false);
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className={styles.container}
        >
            <div className={styles.wrapper}>
                <Dialog.Panel className={styles.panel_wrapper}>
                    <Dialog.Title className={styles.panel_title}>Waiting for an opponent</Dialog.Title>
                    <Dialog.Description className={styles.panel_msg}>
                        {message}
                    </Dialog.Description>

                    <img src={mockups.waitingGIF} />
                    <div className={styles.panel_buttons}>
                        <Button onClick={() => { onDialog(); setIsCopied(true) }}>{isCopied ? 'Copied' : 'Copy'}</Button>
                        <Button onClick={onClose}>Back</Button>

                    </div>

                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

export default WaitingDialog;