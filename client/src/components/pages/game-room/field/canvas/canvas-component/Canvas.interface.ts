import { CanvasHTMLAttributes } from 'react';


export interface ICanvas extends CanvasHTMLAttributes<HTMLCanvasElement> {
    onAnimate: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frameCount: number) => void;
    preDraw: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
    isAnimationStopped: boolean;
}

export interface IUseCanvas extends Pick<ICanvas, "onAnimate" | "preDraw" | "isAnimationStopped"> { }