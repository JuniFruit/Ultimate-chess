import { FC } from "react";
import { PageItem } from "../../../ui/book/PageItem";
import { ISkillPage } from "./SkillBook.interface";
import { SkillItemComponent } from "./SkillItemComponent";



export const SkillPage: FC<ISkillPage> = ({skills,onChooseSkill,board, myColor}) => {


    return (
        <PageItem>
            {
                skills.map(skill => (
                    <SkillItemComponent 
                    board={board} 
                    onClick={onChooseSkill} 
                    skillItem={skill}
                    myColor={myColor}
                    key={skill.title}
                    />
                ))
            }
        </PageItem>
    )
}