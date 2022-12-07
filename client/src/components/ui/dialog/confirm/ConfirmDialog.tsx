import { FC } from 'react'
import { Dialog } from '@headlessui/react'
import { IDialog } from '../Dialog.interface';
import styles from '../Dialog.module.scss';
import { Button } from '../../button/Button';

const ConfirmationDialog: FC<IDialog> = ({ message, onDialog, onClose, isOpen }) => {

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className={styles.container}
        >
            <div className={styles.wrapper}>
                <Dialog.Panel className={styles.panel_wrapper}>
                    <Dialog.Title className={styles.panel_title}>Confirm the action</Dialog.Title>
                    <p className={styles.panel_msg}>
                        {message}
                    </p>
                    <div className={styles.panel_buttons}>
                        <Button onClick={() => { onClose(); onDialog() }}>Confirm</Button>
                        <Button onClick={() => { onClose() }}>Cancel</Button>

                    </div>

                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

export default ConfirmationDialog;