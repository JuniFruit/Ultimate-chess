import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { packApi } from "../../../store/api/pack.api";
import { setTabTitle } from '../../../utils/general.utils';
import MenuButton from '../../ui/menu-button/MenuButton';
import styles from '../home/main-menu/Menu.module.scss';
import { PacksCarousel } from './packs-data/PacksCarousel';
import packStyles from './Packs.module.scss';

const Packs: FC = () => {
    const { data: packs } = packApi.useGetPacksQuery(null);
    const navigate = useNavigate();
    setTabTitle("Ultimate Chess Packs")

    return (
        <div className={`${styles.wrapper} ${packStyles.wrapper}`}>
            <PacksCarousel
                packs={packs || []}
            />
            <MenuButton
                onClick={() => navigate('/')}>
                Menu
            </MenuButton>

        </div>
    )
}

export default Packs;