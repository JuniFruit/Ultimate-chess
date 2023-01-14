import { FC } from 'react';
import { ImagePreview } from '../../../ui/SuspenseWrapper';
import { ITutorialPage } from './Tutorial.interface';
import styles from './Tutorial.module.scss';

export const TutorialPage: FC<ITutorialPage> = ({ body, title, img }) => {

    return (
        <div className={styles.tutorial_page}>
            <div className={styles.img_container}>
                <ImagePreview imageSrc={img} />
            </div>
            <div className={styles.page_body}>
                <h2>{title}</h2>
                <p>{body}</p>
            </div>
        </div>
    )


}