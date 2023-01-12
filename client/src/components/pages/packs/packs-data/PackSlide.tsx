import { FC } from 'react';
import { ImagePreview } from '../../../ui/image-preview/ImagePreview';
import { IPackSlide } from './PacksCarousel.interface';
import styles from '../Packs.module.scss';

export const PackSlide: FC<IPackSlide> = ({ onChoosePack, preview, packId, title, isInUse }) => {


    return (
        <div 
        onClick={() => onChoosePack(packId)} 
        className={styles.slide_wrapper} 
        tabIndex={0} 
        role={'button'} 
        onKeyDown={(e) => e.key === 'Enter'}
        >
            <h2>{title}</h2>
            <ImagePreview imageSrc={preview} />
            {isInUse ? <h3>in use</h3> : null}
        </div>
    )
}