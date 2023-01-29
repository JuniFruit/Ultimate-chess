import { FC } from 'react';
import { IoTelescopeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { setTabTitle } from '../../../utils/general.utils';
import MenuButton from '../../ui/menu-button/MenuButton';
import styles from './NotFound.module.scss';

const NotFoundPage: FC = () => {

    const navigate = useNavigate();
    setTabTitle('Ultimate Chess Not Found');

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.body}>
                    <h2>Sorry, such page doesn't exist</h2>
                    <IoTelescopeOutline />
                </div>
                <MenuButton onClick={() => navigate('/')}>
                    Menu
                </MenuButton>
            </div>

        </div>
    )

}

export default NotFoundPage