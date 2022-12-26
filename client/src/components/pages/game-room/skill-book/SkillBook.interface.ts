import { ISkillItem, SkillNames } from "../../../../model/ultimate/Skills";


export interface ISkillItemComponent extends ISkillItem {
    onClick: (skill:SkillNames) => void;
}

export interface ISkillPage  {
    skills: ISkillItem[];
    onChooseSkill: (skill:SkillNames) => void;
}

export interface ISkillBook {
    onChooseSkill: (skill:SkillNames) => void;
    onClose: () => void;
}