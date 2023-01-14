import { FC,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import WaitingDialog from '../../../ui/dialog/waiting/WaitingDialog';

export const WaitingModal: FC = () => {

    const [dialogOpen, setDialogOpen] = useState(true);

    const navigate = useNavigate();

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
    }

    const handleClose = () => {
        setDialogOpen(false);
        navigate('/');
    }

    return (
        <>
            <WaitingDialog
                onDialog={handleCopy}
                message="Please copy the link and send it to your friend to start the game"
                isOpen={dialogOpen}
                onClose={handleClose} />
        </>
    )
}

export default WaitingModal