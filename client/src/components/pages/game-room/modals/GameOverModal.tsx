import { FC,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import GameOverDialog from '../../../ui/dialog/game-over/GameOverDialog';
import { IGameOverModal } from './Modal.interface';

export const GameOverModal: FC<IGameOverModal> = ({resultMsg, onRematch}) => {

    const [dialogOpen, setDialogOpen] = useState(true);

    const navigate = useNavigate();   

    const handleClose = () => {
        setDialogOpen(false);
        navigate('/');
    }

    return (
        <>
            <GameOverDialog
                onDialog={onRematch}
                message={resultMsg}
                isOpen={dialogOpen}
                onClose={handleClose} />
        </>
    )
}
