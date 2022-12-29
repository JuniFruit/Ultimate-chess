import { Effects } from "../../../assets/Effects/Effects";
import { SkillNames } from "../../ultimate/Skills"
import { IVFXConstructor } from "../VFX";



export const effectList: IEffectItem[] = [{
    title: SkillNames.INCINERATE,
    framesHold: 5,
    framesMax: 8,
    isLooped: true,
    sprite: Effects.fireLoop

}]



export interface IEffectItem extends Pick<IVFXConstructor, "framesHold" | "isLooped" | "framesMax" | "sprite"> {
    title: SkillNames;
}