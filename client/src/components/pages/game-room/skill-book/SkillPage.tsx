import { FC } from "react";
import { ISkillItem } from "../../../../model/ultimate/Skills";
import { PageItem } from "../../../ui/book/PageItem";
import { ISkillPage } from "./SkillBook.interface";
import { SkillItemComponent } from "./SkillItemComponent";



export const SkillPage: FC<ISkillPage> = ({ skills, onChooseSkill }) => {


    return (
        <PageItem>
            {
                skills.map(skill => (
                    <SkillItemComponent {...{ ...skill }} onClick={onChooseSkill} />
                ))
            }
        </PageItem>
    )
}