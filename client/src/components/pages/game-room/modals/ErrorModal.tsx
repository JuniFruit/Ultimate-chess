import { FC,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ErrorDialog from '../../../ui/dialog/errors/ErrorDialog';
import { IErrorModal } from './Modal.interface';

export const ErrorModal: FC<IErrorModal> = ({errorHandler, errorMsg}) => {

    const [dialogOpen, setDialogOpen] = useState(true);

    const navigate = useNavigate();   

    const handleClose = () => {
        errorHandler('');
        setDialogOpen(false);
        navigate('/');
    }

    return (
        <>
            <ErrorDialog
                onDialog={handleClose}
                message={errorMsg}
                isOpen={dialogOpen}
                onClose={() => {}} />
        </>
    )
}
