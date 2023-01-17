import { FC } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { IoConstruct } from 'react-icons/io5';
import MenuButton from '../../ui/menu-button/MenuButton';
import styles from './Error.module.scss';

export const ErrorFallback: FC<FallbackProps> = ({ error }) => {


    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.body}>
                    <h2>Something went wrong. Try to reload the page</h2>
                    <IoConstruct />
                </div>
                <MenuButton onClick={() => window.open(window.location.href)}>
                    Menu
                </MenuButton>
            </div>

        </div>
    )

}

