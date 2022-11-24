import { FC } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { api } from '../../../../store/api/api';
import { packApi } from '../../../../store/api/pack.api';
import MenuButton from '../../../ui/menu-button/MenuButton';
import styles from './PackMenu.module.scss';
import { IPackMenu } from './PacksMenu.interface';

export const PackMenu: FC<IPackMenu> = ({ packs, setPreview }) => {

    const {user} = useAuth()
    const {data: profile} = api.useGetProfileQuery(null, {
        skip: !user,
    })
    const [addPack] = packApi.useAddPackToProfileMutation();

    const handleAdd = (packId:number) => {
        if (packId === profile?.packInUse.id) return;
        addPack(packId)
    }

    return (
        <section className={styles.wrapper}>
            <div className={styles.menu_box}>
                {packs.length
                    ?
                    packs.map(pack => {
                        return <MenuButton
                        onFocus={() => setPreview(pack.preview)}
                        onMouseOver={() => setPreview(pack.preview)}
                        onClick={() => handleAdd(pack.id)}
                        >
                            {`${pack.name} ${pack.id === profile?.packInUse?.id ? ': in use' : ''}`}
                        </MenuButton>
                    })
                    : null
                }
            </div>
        </section>
    )
}