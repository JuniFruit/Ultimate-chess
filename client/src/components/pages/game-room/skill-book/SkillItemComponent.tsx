
import {FC} from 'react';
import { ISkillItemComponent } from './SkillBook.interface';
import styles from './SkillBook.module.scss';

export const SkillItemComponent: FC<ISkillItemComponent> = ({description, title, constraints, lasts, onClick}) => {

    return (
        <div 
        className={styles.skill_item_wrapper}
        onClick={() => onClick(title)}
        title={`${title}. ${description}. ${constraints}. ${lasts ? `Lasts ${lasts} moves` : ''}`}
        >
            <div className={styles.skill_info}>
                <h2>{title}</h2>
                <p>{description}</p>
                <h3>{constraints}</h3>
                {lasts && <span>Lasts {lasts} moves</span>}
            </div>
        </div>
    )
}