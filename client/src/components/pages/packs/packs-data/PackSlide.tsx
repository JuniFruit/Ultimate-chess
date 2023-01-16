import { FC, KeyboardEventHandler } from 'react';
import { IPackSlide } from './PacksCarousel.interface';
import styles from '../Packs.module.scss';
import { ImagePreview } from '../../../ui/SuspenseWrapper';

export const PackSlide: FC<IPackSlide> = ({ onChoosePack, preview, packId, title, isInUse }) => {


    const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === 'Enter') {
            onChoosePack(packId)
        }
    }

    return (
        <div 
        onClick={() => onChoosePack(packId)} 
        className={styles.slide_wrapper} 
        tabIndex={0} 
        aria-label={`add ${title} pack`}
        role={'button'} 
        onKeyDown={handleKeyPress}
        >
            <h2>{title}</h2>
            <ImagePreview imageSrc={preview} />
            {isInUse ? <h3>in use</h3> : null}
        </div>
    )
}