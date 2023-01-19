import { getCellSize } from "../../components/pages/game-room/field/canvas/utils/canvas.utils";
import { Direction } from "../helper.enum";
import { SkillNames } from "../ultimate/Skills";
import { EffectNames } from "./data/effects.data";
import { ISprite, ISpriteConstructor, Sprite } from "./Sprite";


export interface IVFX extends ISprite {
    _scale: number;
    title: SkillNames | EffectNames;
    position: IVFXPosition;
    destImgWidth: number;
    destImgHeight: number;
    offsetX: number;
    offsetY: number;
    scaleToCellSize: (canvas: HTMLCanvasElement) => void;
    updateVFX: (ctx: CanvasRenderingContext2D) => void;
    rescaleAndCenter: () => void;
    flipPosition: () => void;
    updatePosition: (x: number, y: number) => void;
    scaleBy: (value: number) => void;
    moveEffect: (to: IVFXPosition) => void;
}

export interface IVFXPosition {
    x: number;
    y: number;
}

export interface IVFXConstructor extends ISpriteConstructor {
    title: SkillNames | EffectNames;
    position: IVFXPosition;
    scale?: number;
    offsetX?: number;
    offsetY?: number;
}

export class VFX extends Sprite implements IVFX {
    _scale;
    position: IVFXPosition;
    title;
    destImgWidth;
    destImgHeight;
    offsetX;
    offsetY;

    constructor({
        sprite,
        framesMaxHeight = 1,
        framesMaxWidth = 1,
        isLooped,
        framesHold = 10,
        scale = 1,
        title,
        offsetX = 0,
        offsetY = 0,
        position }: IVFXConstructor) {

        super({ sprite, framesMaxHeight, framesMaxWidth, framesHold, isLooped });
        this.title = title;
        this._scale = scale;
        this.position = position;
        this.destImgHeight = this.image.height;
        this.destImgWidth = this.image.width;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    public flipPosition() {
        this.position.x = 7 - this.position.x;
        this.position.y = 7 - this.position.y;
    }

    public scaleBy(value: number) {
        this._scale = value;
    }


    public scaleToCellSize(canvas: HTMLCanvasElement) {
        const { w, h } = getCellSize(canvas);
        const scale_factorW = w / (this.image.width / this.framesMaxWidth);
        const scale_factorH = h / (this.image.height / this.framesMaxHeight);
        this.destImgWidth = (this.image!.width / this.framesMaxWidth) * scale_factorW;
        this.destImgHeight = (this.image.height / this.framesMaxHeight) * scale_factorH;
    }

    public updateVFX(ctx: CanvasRenderingContext2D): void {

        const prevDestImgH = this.destImgHeight / this._scale;
        const prevDestImgW = this.destImgWidth / this._scale;
        const diffW = this.destImgWidth - prevDestImgW
        const diffH = this.destImgHeight - prevDestImgH


        super.update({
            ctx,
            x: ((this.position.x - this.offsetX) * prevDestImgW) - (diffW / 2), // Accounting for rescale
            y: ((this.position.y - this.offsetY) * prevDestImgH) - (diffH / 2),
            imgHeight: this.destImgHeight,
            imgWidth: this.destImgWidth
        });
    }

    public updatePosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
    }

    public rescaleAndCenter() {

        const newImgH = this.destImgHeight * this._scale;
        const newimgW = this.destImgWidth * this._scale;

        this.destImgHeight = newImgH;
        this.destImgWidth = newimgW;
    }

    public moveEffect(to: IVFXPosition) {
        const speedScale = 1.5;

        if (Number(this.position.x.toFixed(0)) !== to.x) {
            const dirX = to.x > this.position.x ? Direction.POS : Direction.NEG;
            const diffX = Math.abs(to.x - this.position.x)
            this.position.x += ((0.25 * (diffX / speedScale)) * dirX)
        } else if (Number(this.position.x.toFixed(0)) === to.x) {
            this.position.x = to.x;
        };
        if (Number(this.position.y.toFixed(0)) !== to.y) {
            const dirY = to.y > this.position.y ? Direction.POS : Direction.NEG;
            const diffY = Math.abs(to.y - this.position.y);
            this.position.y += ((0.25 * (diffY / speedScale)) * dirY);
        } else if (Number(this.position.y.toFixed()) === to.y) {
            this.position.y = to.y;

        }
    }

}