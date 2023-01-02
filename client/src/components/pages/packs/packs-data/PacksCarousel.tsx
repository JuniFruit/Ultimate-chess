import { FC } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { api } from '../../../../store/api/api';
import { packApi } from '../../../../store/api/pack.api';
import { Carousel } from '../../../ui/carousel/Carousel';
import styles from '../../home/main-menu/Menu.module.scss';
import { IPackMenu } from './PacksCarousel.interface';
import { PackSlide } from './PackSlide';

export const PacksCarousel: FC<IPackMenu> = ({ packs }) => {

    const { user } = useAuth()
    const { data: profile } = api.useGetProfileQuery(null, {
        skip: !user,
    })
    const [addPack] = packApi.useAddPackToProfileMutation();

    const handleAdd = (packId: number) => {
        if (packId === profile?.packInUse?.id) return;
        addPack(packId)
    }
    const getPackSlides = () => {
        return packs.map(pack => (
            <PackSlide
                preview={pack.preview}
                packId={pack.id}
                onChoosePack={handleAdd}
                title={pack.title}
                isInUse={pack.id === profile?.packInUse?.id}
                key={pack.sysName}
            />

        ))
    }
    return (
        <section className={styles.menu_box}>
            <Carousel
                slides={getPackSlides()}
            />
        </section>
    )
}