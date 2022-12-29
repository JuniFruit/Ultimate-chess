import { SkillNames } from "../ultimate/Skills";
import { IDrawArgs, ISprite, ISpriteConstructor, Sprite } from "./Sprite";


export interface IVFX extends ISprite {
    isLooped: boolean;
    title: SkillNames;
}

export interface IVFXConstructor extends ISpriteConstructor {
    isLooped?: boolean,
    title: SkillNames
}

export class VFX extends Sprite implements IVFX {
    isLooped: boolean;
    title;

    constructor({ sprite, framesMax = 1, isLooped = true, framesHold = 10, title }: IVFXConstructor) {
        super({ sprite, framesMax, framesHold });
        this.isLooped = isLooped;
        this.title = title;

    }

    public update(args: IDrawArgs): void {
        if (!this.isLooped && this.framesElapsed > this.framesMax) return;
        super.update(args);
    }
}