import { FC,useState } from 'react'
import { RequestMessages, Requests } from '../../../../constants/constants';
import ConfirmationDialog from '../../../ui/dialog/confirm/ConfirmDialog';

import { IConfirmModal } from './Modal.interface';

export const ConfirmModal: FC<IConfirmModal> = ({onConfirm, request}) => {

    const [dialogOpen, setDialogOpen] = useState(true);

    const msg = request === Requests.REMATCH ? RequestMessages.REMATCH : RequestMessages.RESIGN;

    const handleClose = () => {
        setDialogOpen(false);
     
    }

    return (
        <>
            <ConfirmationDialog
                onDialog={() => onConfirm(request)}
                message={msg}
                isOpen={dialogOpen}
                onClose={handleClose} />
        </>
    )
}
