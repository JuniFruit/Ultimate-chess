import { useState } from 'react';
import styles from './Menu.module.scss';
import { MenuBox } from "./Menu";
import { IMenu, IMenuData } from './Menu.interface';
import { ImagePreview } from '../../../ui/image-preview/ImagePreview';

function Menu<T extends IMenuData>({ items, onClick }: IMenu<T>) {
    const [previewSrc, setPreviewSrc] = useState('');

    const handleOnHover = (preview: string) => {
        setPreviewSrc(preview)
    }

    return (
        <div className={styles.wrapper}>
            <ImagePreview imageSrc={previewSrc} />
            <MenuBox<T>
                items={items}
                onHover={handleOnHover}
                onClick={onClick}                
            />
        </div>
    )
}

export default Menu;