import { getCellSize } from "../helpers";

export interface ISprite {
    framesHold: number;
    framesMax?: number
    framesCurrent: number
    framesElapsed: number
    image: HTMLImageElement;
    draw: (arg: IDrawArgs) => void;
    update: (arg: IDrawArgs) => void;


}

export interface IDrawArgs {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    x: number;
    y: number;
}

export interface ISpriteConstructor extends Pick<ISprite, "framesMax"> {
    sprite: string;
    framesHold?: number;
}

export class Sprite implements ISprite {
    framesHold: number;
    framesMax;
    framesCurrent = 0
    framesElapsed = 0
    image;

    constructor({ sprite, framesMax = 6, framesHold = 5 }: ISpriteConstructor) {
        this.framesMax = framesMax
        this.image = new Image();
        this.image.src = sprite;

        this.framesHold = framesHold;
    }


    public draw({ canvas, ctx, x, y }: IDrawArgs) {
        const { w, h } = getCellSize(canvas);
        const scale_factor = Math.min(w / (this.image.width / this.framesMax), h / this.image.height);
        const newImgWidth = (this.image!.width / this.framesMax) * scale_factor;
        const newImgHeight = this.image.height * scale_factor;
        
        ctx.drawImage(
            this.image!,
            this.framesCurrent * (this.image!.width / this.framesMax),
            0,
            this.image!.width / this.framesMax,
            this.image!.height,         
            x * newImgWidth,
            y * newImgHeight,
            newImgWidth,
            newImgHeight
        )


    }

    private _animateFrames() {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    public update(args: IDrawArgs) {
        this.draw(args);
        this._animateFrames();
    }

}