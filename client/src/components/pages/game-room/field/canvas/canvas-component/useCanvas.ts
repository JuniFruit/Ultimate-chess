import { useEffect, useRef } from "react"
import { useResize } from "../../../../../../hooks/useResize";
import { resizeCanvas } from "../utils/canvas.utils";
import { IUseCanvas } from "./Canvas.interface";



export const useCanvas = ({ onAnimate, preDraw, isAnimationStopped }: IUseCanvas) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentWidth = useResize();

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId: number;      
        resizeCanvas(canvas);
        preDraw(context!, canvas)
        if (isAnimationStopped) return;
        const render = () => {           

            //Render

            animationFrameId = window.requestAnimationFrame(render)
            frameCount++
            onAnimate(context!, canvas, frameCount)
        }
        render()
        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }


    }, [onAnimate, isAnimationStopped, currentWidth])

    return canvasRef;
}