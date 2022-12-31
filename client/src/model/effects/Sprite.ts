import { getCellSize } from "../../components/pages/game-room/field/canvas/utils/canvas.utils";

export interface ISprite {
    framesHold: number;
    framesMaxWidth?: number;
    framesMaxHeight?: number;
    framesCurrentWidth: number;
    framesCurrentHeight: number;
    framesElapsed: number
    framesTotal: number;
    framesTotalElapsed: number;
    image: HTMLImageElement;
    draw: (arg: IDrawArgs) => void;
    update: (arg: IDrawArgs) => void;
    rescaleToCellSize: (canvas: HTMLCanvasElement) => { imgW: number, imgH: number }


}

export interface IDrawArgs {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    imgWidth: number,
    imgHeight: number,
}

export interface ISpriteConstructor extends Pick<ISprite, "framesMaxWidth" | "framesMaxHeight"> {
    sprite: string;
    framesHold?: number;
}

export class Sprite implements ISprite {
    framesHold: number;
    framesMaxWidth;
    framesMaxHeight;
    framesCurrentWidth = 0
    framesCurrentHeight = 0
    framesElapsed = 0
    image;
    framesTotal;
    framesTotalElapsed = 0;

    constructor({ sprite, framesMaxWidth = 6, framesMaxHeight = 1, framesHold = 5 }: ISpriteConstructor) {
        this.framesMaxWidth = framesMaxWidth;
        this.framesMaxHeight = framesMaxHeight;
        this.image = new Image();
        this.image.src = sprite;
        this.framesHold = framesHold;
        this.framesTotal = this.framesMaxWidth * this.framesMaxHeight;
    }


    public draw({ ctx, x, y, imgHeight, imgWidth }: IDrawArgs) {
        ctx.drawImage(
            this.image!,
            this.framesCurrentWidth * (this.image!.width / this.framesMaxWidth),
            this.framesCurrentHeight * (this.image!.height / this.framesMaxHeight),
            this.image!.width / this.framesMaxWidth,
            this.image!.height / this.framesMaxHeight,
            x,
            y,
            imgWidth,
            imgHeight,
        )


    }

    public rescaleToCellSize(canvas: HTMLCanvasElement) {
        const { w, h } = getCellSize(canvas);
        const scale_factor = Math.min(w / (this.image.width / this.framesMaxWidth), h / (this.image.height / this.framesMaxHeight));
        const imgW = (this.image!.width / this.framesMaxWidth) * scale_factor;
        const imgH = (this.image.height / this.framesMaxHeight) * scale_factor;

        return { imgW, imgH }
    }

    private _animateFrames() {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            this.framesTotalElapsed++;
            if (this.framesCurrentWidth < this.framesMaxWidth - 1) {
                this.framesCurrentWidth++
            } else if (this.framesCurrentHeight < this.framesMaxHeight - 1) {
                this.framesCurrentWidth = 0
                this.framesCurrentHeight++;
            } else {
                this.framesCurrentHeight = 0;
                this.framesCurrentWidth = 0;
            }
        }
    }

    public update(args: IDrawArgs) {
        this.draw(args);
        this._animateFrames();
    }

}