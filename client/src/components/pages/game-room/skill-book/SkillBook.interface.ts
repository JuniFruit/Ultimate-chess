import { Colors } from "../../../../model/colors.enum";
import { IBoardUlt } from "../../../../model/ultimate/BoardUlt";
import { ISkillItem } from "../../../../model/ultimate/Skills";


export interface ISkillItemComponent {
    onClick: (skill: ISkillItem) => void;
    board: IBoardUlt;
    myColor: Colors;
    skillItem: ISkillItem;
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