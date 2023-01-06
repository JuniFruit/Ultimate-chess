
export interface ISprite {
    framesHold: number;
    framesMaxWidth?: number;
    framesMaxHeight?: number;
    framesCurrentWidth: number;
    framesCurrentHeight: number;
    framesElapsed: number
    framesTotal: number;
    framesTotalElapsed: number;
    isLooped: boolean;
    image: HTMLImageElement;
    update: (arg: IDrawArgs) => void;
}

export interface IDrawArgs {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    imgWidth: number,
    imgHeight: number,
}

export interface ISpriteConstructor extends Pick<ISprite, "framesMaxWidth" | "framesMaxHeight" | "isLooped"> {
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
    isLooped: boolean;


    constructor({ sprite, framesMaxWidth = 6, framesMaxHeight = 1, framesHold = 5, isLooped }: ISpriteConstructor) {
        this.framesMaxWidth = framesMaxWidth;
        this.framesMaxHeight = framesMaxHeight;
        this.image = new Image();
        this.image.src = sprite;
        this.framesHold = framesHold;
        this.framesTotal = this.framesMaxWidth * this.framesMaxHeight;
        this.isLooped = isLooped
    }


    private _draw({ ctx, x, y, imgHeight, imgWidth }: IDrawArgs) {
        // console.log(imgHeight, this.image.height)
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



    private _animateFrames() {
        this.framesElapsed++

        if (!this.isLooped && this.framesTotalElapsed >= this.framesTotal - 1) {
            this.framesCurrentHeight = -1;
            this.framesCurrentWidth = -1;
            return;
        }

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
        this._draw(args);
        this._animateFrames();
    }

}