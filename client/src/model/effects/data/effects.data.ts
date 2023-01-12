import { Effects } from "../../../assets/Effects/Effects";
import { SkillNames } from "../../ultimate/Skills"
import { IVFXConstructor } from "../VFX";

export enum EffectNames {
    ON_MOVE = 'onMove',
    ON_CASTLE = 'onCastle'
}

// Offsets: PositiveY = Upwards, PostiveX = Left, Range 0 - 1;

export const effectList: IEffectItem[] = [{
    title: SkillNames.SACRIFICE,
    framesHold: 5,
    framesMaxWidth: 6,
    framesMaxHeight: 6,
    isLooped: false,
    sprite: Effects.blood,

},

{

    title: SkillNames.INCINERATE,
    framesHold: 5,
    framesMaxWidth: 6,
    framesMaxHeight: 1,
    isLooped: true,
    sprite: Effects.fireLoop,

},
{
    title: SkillNames.LIGHTNING_BOLT,
    framesHold: 5,
    framesMaxWidth: 16,
    framesMaxHeight: 1,
    scale: 2,
    isLooped: false,
    sprite: Effects.lightning,
    offsetY: 0.7
},
{
    title: SkillNames.PLAGUE,
    framesHold: 3,
    framesMaxWidth: 10,
    framesMaxHeight: 1,
    isLooped: false,
    scale: 2,
    sprite: Effects.expl_plague
},
{
    title: EffectNames.ON_MOVE,  //Appeares after each moves
    framesHold: 3,
    framesMaxWidth: 10,
    framesMaxHeight: 1,
    isLooped: false,
    scale: 2,
    sprite: Effects.explosion2
},
{
    title: EffectNames.ON_CASTLE,  
    framesHold: 7,
    framesMaxWidth: 5,
    framesMaxHeight: 1,
    isLooped: false,
    scale: 1,
    sprite: Effects.shield
},
{
    title: SkillNames.SET_BOMB,
    framesHold: 3,
    framesMaxWidth: 10,
    framesMaxHeight: 1,
    isLooped: false,
    scale: 2,
    sprite: Effects.explosion2
},
{
    title: SkillNames.DETONATE,
    framesHold: 3,
    framesMaxWidth: 10,
    framesMaxHeight: 1,
    isLooped: false,
    scale: 2,
    sprite: Effects.expl_plague
}


]



export interface IEffectItem extends Pick<IVFXConstructor, "framesHold"
    | "isLooped" | "framesMaxWidth" | "framesMaxHeight" | "sprite" | "scale" | "offsetX" | "offsetY"> {
    title: SkillNames | EffectNames;
}