import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../layout/Layout';
import styles from './NotFound.module.scss';
import { IoTelescopeOutline } from 'react-icons/io5';
import MenuButton from '../../ui/menu-button/MenuButton';

export const NotFoundPage: FC = () => {

    const navigate = useNavigate()

    return (
        <Layout title='Ultimate Chess Not Found'>
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
        </Layout>
    )

}