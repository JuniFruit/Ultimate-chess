import { FC, useEffect } from 'react'
import { useTypedSelector } from '../../../hooks/useTypedSelector'
import { IoCheckmarkCircleOutline, IoWarningOutline, IoAlertOutline } from 'react-icons/io5';
import styles from './InfoPop.module.scss';
import { Button } from '../button/Button';
import { useActions } from '../../../hooks/useActions';


export const InfoPop: FC = () => {

    const { message, type } = useTypedSelector(state => state.message);
    const { clearMsg } = useActions();


    useEffect(() => {

        const timeout = setTimeout(() => {
            clearMsg()
        }, 3000)

        return () => {
            clearTimeout(timeout);
        }
    }, [message, type])

    if (!message) return null;


    return (
        <div className={`${styles.message_body} ${styles[type]}`}>
            <div className={styles.message_wrapper}>
                <div className={styles.icon}>
                    {type === 'success' && <IoCheckmarkCircleOutline />}
                    {type === 'warining' && <IoWarningOutline />}
                    {type === 'error' && <IoAlertOutline />}
                </div>
                <div className={styles.message}>
                    <p>{message}</p>
                </div>
                <Button className={styles.message_close} onClick={(e) => { e.preventDefault(); clearMsg() }}>
                    X
                </Button>
            </div>
            <div className={styles.progress_line}>
                <div className={styles.line}></div>
            </div>
        </div>

    )

} 