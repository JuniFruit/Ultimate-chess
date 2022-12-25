import { FC, MouseEventHandler } from 'react'
import { ISkill } from './Skill.interface';
import styles from './Skill.module.scss';


export const SkillBook: FC<ISkill> = ({ onSkillSelect }) => {


    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        onSkillSelect((e.target as HTMLButtonElement).innerHTML)
    }

    return (
        <div className={styles.book}>
            <button onClick={handleClick}>suicide</button>
        </div>
    )
}