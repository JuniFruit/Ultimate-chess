import { FC } from 'react';
import { mockups } from '../../../assets/mockups/images';
import styles from './ImagePreview.module.scss';

const ImagePreview: FC<{ imageSrc?: string }> = ({ imageSrc }) => {

    return (
        <div className={styles.wrapper}>
            {imageSrc && <img
                src={imageSrc}
                alt={imageSrc}
                onError={(e) => { (e.target as any).onerror = null; (e.target as any).target.src = mockups.defaultAvatar }}
            />}
        </div>
    )
}

export default ImagePreview