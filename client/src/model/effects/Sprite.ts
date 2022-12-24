import { getCellSize } from "../helpers";

export interface ISprite {
    readonly framesHold: number;
    framesMax?: number
    framesCurrent: number
    framesElapsed: number
    scale?: number;
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

export interface ISpriteConstructor extends Pick<ISprite, "scale" | "framesMax"> {
    sprite: string;
}

export class Sprite implements ISprite {
    readonly framesHold = 10;
    framesMax;
    framesCurrent = 0
    framesElapsed = 0
    scale;
    image;

    constructor({ scale = 1.5, sprite, framesMax = 6 }: ISpriteConstructor) {
        this.framesMax = framesMax
        this.scale = scale;
        this.image = new Image();
        this.image.src = sprite
    }


    public draw({ canvas, ctx, x, y }: IDrawArgs) {
        const { w, h } = getCellSize(canvas)


        ctx.drawImage(
            this.image!,
            this.framesCurrent * (this.image!.width / this.framesMax),
            0,
            this.image!.width / this.framesMax,
            this.image!.height,
            x * w,
            y * h,
            (this.image!.width / this.framesMax) * this.scale,
            this.image.height * this.scale
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