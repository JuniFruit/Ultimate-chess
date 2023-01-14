import { useState } from 'react';
import styles from './Menu.module.scss';
import { MenuBox } from "./Menu";
import { IMenu, IMenuData } from './Menu.interface';
import { useIsMobile } from '../../../../hooks/useMobile';
import { ImagePreview } from '../../../ui/SuspenseWrapper';

function Menu<T extends IMenuData>({ items, onClick }: IMenu<T>) {
    const [previewSrc, setPreviewSrc] = useState('');
    const { isMobile } = useIsMobile()

    const handleOnHover = (preview: string) => {
        if (isMobile) return;
        setPreviewSrc(preview)
    }

    return (
        <div className={styles.wrapper}>
            {isMobile ? null : <ImagePreview imageSrc={previewSrc} />}
            <MenuBox<T>
                items={items}
                onHover={handleOnHover}
                onClick={onClick}
            />
        </div>
    )
}

export default Menu;