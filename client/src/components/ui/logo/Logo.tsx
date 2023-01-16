import { FC } from 'react'
import { Link } from 'react-router-dom'
import styles from './Logo.module.scss';


export const Logo: FC = () => {



    return (
        <Link
            to={'/'} className={styles.logo}
            tabIndex={0} title={'Go to Main Menu'}
            aria-label={'Go to Main Menu'}>

            <span>Ultimate</span>
            <span>Chess</span>
        </Link>

    )
}