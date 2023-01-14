import { FC, useEffect, useState } from 'react';
import { RequestMessages, Requests } from '../../../../constants/constants';
import ConfirmationDialog from '../../../ui/dialog/confirm/ConfirmDialog';

import { IConfirmModal } from './Modal.interface';

const ConfirmModal: FC<IConfirmModal> = ({ onConfirm, request, onClose }) => {

    const [dialogOpen, setDialogOpen] = useState(false);


    useEffect(() => {
        setDialogOpen(prev => request === Requests.REMATCH ||
            request === Requests.RESIGN)
    }, [request])


    const msg = request === Requests.REMATCH ? RequestMessages.REMATCH : RequestMessages.RESIGN;

    const handleClose = () => {
        setDialogOpen(false)
        onClose()
    }

    return (
        <>
            <ConfirmationDialog
                onDialog={() => onConfirm(request!)}
                message={msg}
                isOpen={dialogOpen}
                onClose={handleClose} />
        </>
    )
}

export default ConfirmModal;
