import { ICellInfo } from "../Cell";
import { Colors } from "../colors.enum";

export enum SkillNames {
    SACRIFICE = 'Sacrifice',
    INCINERATE = 'Incinerate',
    INVISIBILITY = 'Invisibility',
    LIGHTNING_BOLT = 'Lightning bolt',
}


export enum SkillTypes {
    DISABLER = 'Disabler'
}

export const SkillList: ISkillItem[] = [
    {
        title: SkillNames.SACRIFICE,
        description: 'You can sacrifice one of your pawns once',
        constraints: 'Cannot be performed on a last standing pawn',
        isTargeted: true,

    },
    {
        title: SkillNames.INVISIBILITY,
        description: 'Makes one of your pieces invisible for the enemy',
        constraints: 'Cannot be performed on a King',
        lasts: 4,
        isTargeted: true,

    },
    {
        title: SkillNames.INCINERATE,
        description: 'Sets a square on fire, making it unreachable for any pieces. Acts like a wall',
        constraints: 'Cannot be performed on an occupied square',
        lasts: 4,
        isTargeted: true,

    },
    {
        title: SkillNames.LIGHTNING_BOLT,
        description: 'Stuns an enemy piece, making it unable to move',
        constraints: 'Cannot be performed on a King',
        lasts: 4,
        type: SkillTypes.DISABLER,
        isTargeted: true,

    }

]


export interface ISkillItem {
    title: SkillNames;
    description: string;
    constraints: string;
    isTargeted: boolean;
    lasts?: number;
    type?: SkillTypes;
}

export enum SkillErrorMsg {
    INVALID_TARGET = 'Cannot apply to this target',
    NOT_YOUR_TURN = 'Not your turn',
    INVALID_STATE = 'Cannot use skills before the first move',
    IN_CHECK = 'Cannot use skills while in check'
}

export interface ISkillUsed {
    title: SkillNames;
    target: ICellInfo;
    castBy: Colors;
    lasts?: number;
    appliedAt: number;
}

export interface ISkillApplied extends Pick<ISkillUsed, "title" |  "castBy" >{
    expireAt: number;
    type?: SkillTypes;
}