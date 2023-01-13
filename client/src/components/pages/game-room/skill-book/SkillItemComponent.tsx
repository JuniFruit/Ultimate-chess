
import { FC } from 'react';
import { ISkillItemComponent } from './SkillBook.interface';
import styles from './SkillBook.module.scss';

export const SkillItemComponent: FC<ISkillItemComponent> = ({
    onClick,
    board,
    myColor,
    skillItem
}) => {

    const { title, description, lasts, constraints } = skillItem;
    const isDisabled = board.states.skillsUsed.some(skill => skill.title === title && skill.castBy === myColor);


    return (
        <button
            className={styles.skill_item_wrapper}
            onClick={() => onClick({ ...skillItem })}
            disabled={isDisabled}
            title={`${title}. ${description}. ${constraints}. ${lasts ? `Lasts ${lasts} moves` : ''}`}
        >
            <div className={styles.skill_info}>
                <h2>{title}</h2>
                <p>{description}</p>
                <h3>{constraints}</h3>
                {lasts && lasts > 0 && <span>Lasts {lasts} moves</span>}
            </div>
        </button>
    )
}