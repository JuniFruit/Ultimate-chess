import { ICellInfo } from "../Cell";
import { Colors } from "../colors.enum";

export enum SkillNames {
    SACRIFICE = 'Sacrifice',
    INCINERATE = 'Incinerate',
    PLAGUE = 'Plague',
    LIGHTNING_BOLT = 'Lightning bolt',
    SET_BOMB = 'Set bomb',
    DETONATE = 'Detonate'
}


export enum SkillTypes {
    DISABLER = 'Disabler'
}

export const SkillList: ISkillItem[] = [
    {
        title: SkillNames.SACRIFICE,
        description: 'Sacrifices one of your pawns',
        constraints: 'Cannot be performed on a last standing pawn',
        isTargeted: true,
        canBeAppliedAt: 'figure',
    },
    {
        title: SkillNames.INCINERATE,
        description: 'Sets a square on fire, making it unreachable for any pieces. Acts like a wall',
        constraints: 'Cannot be performed on an occupied square',
        lasts: 4,
        isTargeted: true,
        canBeAppliedAt: 'cell'
    },
    {
        title: SkillNames.LIGHTNING_BOLT,
        description: 'Stuns an enemy piece, making it unable to move',
        constraints: 'Cannot be performed on a King',
        lasts: 4,
        type: SkillTypes.DISABLER,
        isTargeted: true,
        canBeAppliedAt: 'figure'
    },
    {
        title: SkillNames.PLAGUE,
        lasts: 6,
        description: `Curses an enemy pawn, making it die from plague in 6 moves`,
        constraints: 'Cannot be performed on a last standing pawn',
        isTargeted: true,
        canBeAppliedAt: 'figure',
        onExpire: SkillNames.SACRIFICE
    },
    {
        title: SkillNames.SET_BOMB,
        lasts: 4,
        description: 'Places a bomb on a cell that will detonate in 4 moves and affect closest cells',
        constraints: 'Cannot be performed on an occupied square',
        isTargeted: true,
        canBeAppliedAt: 'cell',
        onExpire: SkillNames.DETONATE
    },
    {
        title: SkillNames.DETONATE,
        description: 'Incinerates all cells around in the range of 1',
        constraints: 'Cannot be performed directly by a player',
        isTargeted: false,
        canBeAppliedAt: 'cell'
    }

]


export interface ISkillItem {
    title: SkillNames;
    description: string;
    constraints: string;
    isTargeted: boolean;
    lasts?: number;
    type?: SkillTypes;
    onExpire?: SkillNames; // what skill will be used after expiration
    canBeAppliedAt: 'cell' | 'figure';

}

export enum SkillErrorMsg {
    INVALID_TARGET = 'Cannot apply to this target',
    NOT_YOUR_TURN = 'Not your turn',
    INVALID_STATE = 'Cannot use skills before the first move',
    IN_CHECK = 'Cannot use skills while in check'
}

export interface ISkillUsed extends Pick<ISkillItem, "title" | "lasts" | "onExpire"> {
    target: ICellInfo;
    castBy: Colors;
    appliedAt: number;
}

export interface ISkillApplied extends Pick<ISkillUsed, "title" | "castBy" | "onExpire"> {
    expireAt: number;
    type?: SkillTypes;
}
