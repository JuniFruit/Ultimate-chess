import { FC, PropsWithChildren } from "react";
import styles from './Book.module.scss';


export const PageItem: FC<PropsWithChildren> = ({children}) => {


    return (
        <div className={styles.page}>
            {children}
        </div>
    )
}

