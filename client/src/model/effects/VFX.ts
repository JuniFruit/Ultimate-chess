import { getCellSize } from "../../components/pages/game-room/field/canvas/utils/canvas.utils";
import { SkillNames } from "../ultimate/Skills";
import { EffectNames } from "./data/effects.data";
import { ISprite, ISpriteConstructor, Sprite } from "./Sprite";


export interface IVFX extends ISprite {
    readonly scale: number;
    title: SkillNames | EffectNames;
    position: IVFXPosition;
    destImgWidth: number;
    destImgHeight: number;
    scaleToCellSize: (canvas: HTMLCanvasElement) => void;
    updateVFX: (ctx: CanvasRenderingContext2D) => void;
    rescaleAndCenter: () => void;
    flipPosition: () => void;
    updatePosition: (x: number, y: number) => void;
}

export interface IVFXPosition {
    x: number;
    y: number;
}

export interface IVFXConstructor extends ISpriteConstructor {
    title: SkillNames | EffectNames;
    position: IVFXPosition;
    scale?: number
}

export class VFX extends Sprite implements IVFX {
    readonly scale;
    position: IVFXPosition;
    title;
    destImgWidth;
    destImgHeight;

    constructor({
        sprite,
        framesMaxHeight = 1,
        framesMaxWidth = 1,
        isLooped,
        framesHold = 10,
        scale = 1,
        title,
        position }: IVFXConstructor) {

        super({ sprite, framesMaxHeight, framesMaxWidth, framesHold, isLooped });
        this.title = title;
        this.scale = scale;
        this.position = position;
        this.destImgHeight = this.image.height;
        this.destImgWidth = this.image.width;
    }

    public flipPosition() {
        this.position.x = 7 - this.position.x;
        this.position.y = 7 - this.position.y;
    }


    public scaleToCellSize(canvas: HTMLCanvasElement) {
        const { w, h } = getCellSize(canvas);
        const scale_factor = Math.min(w / (this.image.width / this.framesMaxWidth), h / (this.image.height / this.framesMaxHeight));
        this.destImgWidth = (this.image!.width / this.framesMaxWidth) * scale_factor;
        this.destImgHeight = (this.image.height / this.framesMaxHeight) * scale_factor;
    }

    public updateVFX(ctx: CanvasRenderingContext2D): void {

        const prevDestImgH = this.destImgHeight / this.scale;
        const prevDestImgW = this.destImgWidth / this.scale;
        const diffW = this.destImgWidth - prevDestImgW
        const diffH = this.destImgHeight - prevDestImgH


        super.update({
            ctx,
            x: (this.position.x * prevDestImgW) - (diffW / 2), // Accounting for rescale
            y: (this.position.y * prevDestImgH) - (diffH / 2),
            imgHeight: this.destImgHeight,
            imgWidth: this.destImgWidth
        });
    }

    public updatePosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
    }

    public rescaleAndCenter() {

        const newImgH = this.destImgHeight * this.scale;
        const newimgW = this.destImgWidth * this.scale;

        this.destImgHeight = newImgH;
        this.destImgWidth = newimgW;

    }
}