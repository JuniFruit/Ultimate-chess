import { Direction } from "../helper.enum";
import { SkillNames } from "../ultimate/Skills";
import { IDrawArgs, ISprite, ISpriteConstructor, Sprite } from "./Sprite";


export interface IVFX extends ISprite {
    readonly scale: number;
    isLooped: boolean;
    title: SkillNames;
}

export interface IVFXConstructor extends ISpriteConstructor {
    isLooped?: boolean,
    title: SkillNames
    scale?: number
}

export class VFX extends Sprite implements IVFX {
    readonly scale;
    isLooped: boolean;
    title;

    constructor({ sprite, framesMaxHeight = 1, framesMaxWidth = 1, isLooped = true, framesHold = 10, scale = 1, title }: IVFXConstructor) {
        super({ sprite, framesMaxHeight, framesMaxWidth, framesHold });
        this.isLooped = isLooped;
        this.title = title;
        this.scale = scale
    }

    public update(args: IDrawArgs): void {
        if (!this.isLooped && this.framesTotalElapsed >= this.framesTotal - 1) return;

        const { newImgH, newX, newY, newimgW } = this._rescaleAndCenter(args);

        super.update({ ...args, x: newX, y: newY, imgHeight: newImgH, imgWidth: newimgW });
    }

    public _rescaleAndCenter({ x, y, imgHeight, imgWidth }: IDrawArgs) {

        const newImgH = imgHeight * this.scale;
        const newimgW = imgWidth * this.scale;
        const diffW = Math.abs(newimgW - imgWidth)
        const diffH = Math.abs(newImgH - imgHeight)
        const dirH = newImgH < imgHeight ? Direction.NEG : Direction.POS;
        const dirW = newimgW < imgWidth ? Direction.NEG : Direction.POS;
        const newX = x - ((diffW / 2) * dirW);
        const newY = y - ((diffH / 2) * dirH);
        return {
            newX,
            newY,
            newImgH,
            newimgW
        }

    }
}