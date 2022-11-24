import {FC} from 'react';
import styles from './ImagePreview.module.scss';

export const ImagePreview:FC<{imageSrc?: string}> = ({imageSrc}) => {

    return (
        <div className={styles.wrapper}>
            <img 
                src={imageSrc}
            />
        </div>
    )
}