import { Colors } from "../../../../model/colors.enum";
import { IBoardUlt } from "../../../../model/ultimate/BoardUlt";
import { ISkillItem, SkillNames } from "../../../../model/ultimate/Skills";


export interface ISkillItemComponent extends ISkillItem {
    onClick: (skill: ISkillItem) => void;
    board: IBoardUlt;
    myColor: Colors
}

export interface ISkillPage {
    skills: ISkillItem[];
    board: IBoardUlt;
    myColor: Colors
    onChooseSkill: (skill: ISkillItem) => void;
}

export interface ISkillBook {
    onChooseSkill: (skill: ISkillItem) => void;
    onClose: () => void;
    board: IBoardUlt;
    myColor: Colors
}