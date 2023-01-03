import { FC } from 'react';
import { packApi } from "../../../store/api/pack.api";
import styles from '../home/main-menu/Menu.module.scss';
import packStyles from './Packs.module.scss';
import { Layout } from "../../layout/Layout";
import { PacksCarousel } from './packs-data/PacksCarousel';
import MenuButton from '../../ui/menu-button/MenuButton';
import { useNavigate } from 'react-router-dom';

const Packs: FC = () => {
    const { data: packs } = packApi.useGetPacksQuery(null);
    const navigate = useNavigate();

    return (
        <Layout title="Ultimate Chess Packs">
            <div className={`${styles.wrapper} ${packStyles.wrapper}`}>
                <PacksCarousel
                    packs={packs || []}
                />
                <MenuButton
                    onClick={() => navigate('/')}>
                    Menu
                </MenuButton>

            </div>
        </Layout>
    )
}

export default Packs;