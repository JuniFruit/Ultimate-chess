import { FC } from 'react'
import { Dialog } from '@headlessui/react'
import styles from '../Dialog.module.scss';
import { IDialog } from '../Dialog.interface';
import { Button } from '../../button/Button';
import { iconsGeneral } from '../../../../assets/icons/general/iconsGeneral';

const ErrorDialog: FC<IDialog> = ({ message, onDialog, isOpen, onClose }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className={styles.container}
        >
            <div className={styles.wrapper} style={{ zIndex: '75' }}>
                <Dialog.Panel className={styles.panel_wrapper}>
                    <Dialog.Title className={styles.panel_title}>Error</Dialog.Title>
                    <Dialog.Description className={styles.panel_msg}>
                        {message}
                    </Dialog.Description>
                    <img
                        src={iconsGeneral.chessCogs}
                        alt={'error icon'}
                    />
                    <div className={styles.panel_buttons}>
                        <Button onClick={onDialog}>Back</Button>
                    </div>

                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

export default ErrorDialog;