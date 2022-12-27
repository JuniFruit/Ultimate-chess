
import {FC} from 'react';
import { ISkillItemComponent } from './SkillBook.interface';
import styles from './SkillBook.module.scss';

export const SkillItemComponent: FC<ISkillItemComponent> = ({description, title, constraints, lasts, onClick ,board, myColor, isTargeted}) => {
    const isDisabled = board.states.skillsUsed.some(skill => skill.title === title && skill.castBy === myColor);
    return (
        <button 
        className={styles.skill_item_wrapper}
        onClick={() => onClick({title,description,constraints,lasts,isTargeted})}
        disabled={isDisabled}
        title={`${title}. ${description}. ${constraints}. ${lasts ? `Lasts ${lasts} moves` : ''}`}
        >
            <div className={styles.skill_info}>
                <h2>{title}</h2>
                <p>{description}</p>
                <h3>{constraints}</h3>
                {lasts && <span>Lasts {lasts} moves</span>}
            </div>
        </button>
    )
}