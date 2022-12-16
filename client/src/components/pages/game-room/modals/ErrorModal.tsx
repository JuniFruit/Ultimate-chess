import { FC,useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import ioClient from '../../../../api/socketApi';
import { Errors } from '../../../../constants/constants';
import ErrorDialog from '../../../ui/dialog/errors/ErrorDialog';
import { IErrorModal } from './Modal.interface';

export const ErrorModal: FC = () => {

    const [errorMsg, setErrorMsg] = useState<Errors | null>()

    const handleOnError = (error: Errors) => {
       
        setErrorMsg(prev => error);
    }

    useEffect(() => {
        ioClient.on("gameError", handleOnError);

        return () => {
            ioClient.off("gameError");
        }
    }, [errorMsg])

    const navigate = useNavigate();   

    const handleClose = () => {
        setErrorMsg(prev => null)      
        navigate('/');
    }

    return (
        <>
            <ErrorDialog
                onDialog={handleClose}
                message={errorMsg!}
                isOpen={errorMsg ? true : false}
                onClose={() => {}} />
        </>
    )
}
