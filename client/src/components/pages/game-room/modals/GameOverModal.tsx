import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../../../../model/colors.enum';
import { GameOver, Results } from '../../../../model/helper.enum';
import GameOverDialog from '../../../ui/dialog/game-over/GameOverDialog';
import { IGameOverModal } from './Modal.interface';

export const GameOverModal: FC<IGameOverModal> = ({result, onRematch, isObserver}) => {

    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        setDialogOpen(prev => result ? true : false);
    }, [result])

    const navigate = useNavigate();   

    const handleResultMsg = () => {
        if (!result) return;
        if (result.result === Results.DRAW) return GameOver.DRAW;
        if (result.loser === Colors.WHITE) return GameOver.BLACK;
        return GameOver.WHITE;
    }


    const handleClose = () => {
        setDialogOpen(false);
        navigate('/');
    }    

    return (
        <>
            <GameOverDialog
                onDialog={onRematch}
                message={handleResultMsg()!}
                isOpen={dialogOpen}
                reason={result?.reason}
                isObserver={isObserver}
                onClose={handleClose} />
        </>
    )
}
