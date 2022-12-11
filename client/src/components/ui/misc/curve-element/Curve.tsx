import { FC } from "react";
import styles from './Curve.module.scss';


export const Curve:FC = () => {

    return (
        <div className={styles.curve_wrapper}>
            <div className={styles.main_el}></div>
        </div>
    )
}