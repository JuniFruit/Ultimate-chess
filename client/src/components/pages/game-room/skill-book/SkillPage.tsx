import { FC } from "react";
import { ISkillItem } from "../../../../model/ultimate/Skills";
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
                    {...{...skill}}  
                    myColor={myColor}
                    key={skill.title}
                    />
                ))
            }
        </PageItem>
    )
}