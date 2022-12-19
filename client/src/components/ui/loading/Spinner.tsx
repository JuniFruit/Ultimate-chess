import { FC } from 'react';
import styles from './Loading.module.scss';

export const Spinner: FC = () => {


    return (
        <div className={styles.spinner_wrapper}>
            <div className={styles.spinner}>
            </div>
        </div>
    )
}