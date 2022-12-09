import { FC } from 'react'
import { Link } from 'react-router-dom'
import styles from './Logo.module.scss';


export const Logo: FC = () => {



    return (
        <Link to={'/'} className={styles.logo}>
            <span>Ultimate</span>
            <span>Chess</span>
        </Link>

    )
}