import { FC, PropsWithChildren } from 'react'

import styles from './Wrapper.module.scss';

const Wrapper: FC<PropsWithChildren<{ title: string }>> = ({ children, title }) => {    

    return (
        <div className={styles.wrapper}>
            <h1>{title}</h1>
            {children}
        </div>
    )

}

export default Wrapper