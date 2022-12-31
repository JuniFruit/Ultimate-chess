import { Effects } from "../../../assets/Effects/Effects";
import { SkillNames } from "../../ultimate/Skills"
import { IVFXConstructor } from "../VFX";



export const effectList: IEffectItem[] = [{
    title: SkillNames.INCINERATE,
    framesHold: 5,
    framesMaxWidth: 18,
    framesMaxHeight: 1,
    isLooped: true,
    sprite: Effects.explosion,    

},
{
    title: SkillNames.LIGHTNING_BOLT,
    framesHold: 10,
    framesMaxWidth: 6,
    framesMaxHeight: 1,
    isLooped: false,
    sprite: Effects.attack
},
{
    title: SkillNames.PLAGUE,
    framesHold: 3,
    framesMaxWidth: 6,
    framesMaxHeight: 6,
    isLooped: false,
    scale: 2,
    sprite: Effects.blood
}]



export interface IEffectItem extends Pick<IVFXConstructor, "framesHold"
    | "isLooped" | "framesMaxWidth" | "framesMaxHeight" | "sprite" | "scale"> {
    title: SkillNames;
}