import { Effects } from "../../../assets/Effects/Effects";
import { SkillNames } from "../../ultimate/Skills"
import { IVFXConstructor } from "../VFX";

export enum EffectNames {
    ON_MOVE = 'onMove',
    ON_CASTLE = 'onCastle',
    DEFAULT = 'default',
    ON_PROMOTION = 'onPromotion',
    ON_TAKE = 'onTake'
}

// Offsets: PositiveY = Upwards, PostiveX = Left, Range 0 - 1;

export const effectList: IEffectItem[] = [{
    title: SkillNames.SACRIFICE,
    framesHold: 3,
    framesMaxWidth: 8,
    framesMaxHeight: 4,
    scale: 2,
    isLooped: false,
    sprite: Effects.blood_2,

},

{

    title: SkillNames.INCINERATE,
    framesHold: 5,
    framesMaxWidth: 6,
    framesMaxHeight: 1,
    scale: 1.2,
    offsetY: .105,
    isLooped: true,
    sprite: Effects.fireLoop,

},
{
    title: SkillNames.LIGHTNING_BOLT,
    framesHold: 3,
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
    framesMaxWidth: 8,
    framesMaxHeight: 4,
    isLooped: false,
    scale: 2,
    sprite: Effects.plague
},
{
    title: EffectNames.ON_MOVE,  //Appeares after each moves
    framesHold: 3,
    framesMaxWidth: 5,
    framesMaxHeight: 1,
    isLooped: false,
    scale: 1,
    sprite: Effects.onMove_5
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
    title: EffectNames.ON_PROMOTION,
    framesHold: 3,
    framesMaxWidth: 8,
    framesMaxHeight: 2,
    isLooped: false,
    scale: 2,
    sprite: Effects.light_2,
},
{
    title: SkillNames.SET_BOMB,
    framesHold: 3,
    framesMaxWidth: 7,
    framesMaxHeight: 2,
    isLooped: false,
    scale: .5,
    sprite: Effects.bomb
},
{
    title: SkillNames.DETONATE,
    framesHold: 3,
    framesMaxWidth: 8,
    framesMaxHeight: 4,
    isLooped: false,
    scale: 3,
    sprite: Effects.expl_big
},
{
    title: EffectNames.ON_TAKE,
    framesHold: 3,
    framesMaxWidth: 8,
    framesMaxHeight: 2,
    isLooped: false,
    scale: 2,
    sprite: Effects.blood
},
{
    title: SkillNames.BLESSING,
    framesHold: 3,
    framesMaxWidth: 8,
    framesMaxHeight: 2,
    isLooped: false,
    scale: 2,
    sprite: Effects.light
},
{
    title: EffectNames.DEFAULT,
    framesHold: 3,
    framesMaxWidth: 8,
    framesMaxHeight: 2,
    isLooped: false,
    scale: 2,
    sprite: Effects.light
}



]



export interface IEffectItem extends Pick<IVFXConstructor, "framesHold"
    | "isLooped" | "framesMaxWidth" | "framesMaxHeight" | "sprite" | "scale" | "offsetX" | "offsetY"> {
    title: SkillNames | EffectNames;
}