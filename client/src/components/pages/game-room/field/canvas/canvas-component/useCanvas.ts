import { useEffect, useRef } from "react"
import { resizeCanvas } from "../utils/canvas.utils";
import { IUseCanvas } from "./Canvas.interface";



export const useCanvas = ({ onAnimate, postDraw, preDraw, isAnimationStopped }: IUseCanvas) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    

    useEffect(() => {

        if (!canvasRef.current) return;
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId: number;
        let secondsPassed;
        let oldTimeStamp:DOMHighResTimeStamp;
        let fps;
        resizeCanvas(canvas);
        preDraw(context!, canvas)
        if (isAnimationStopped) return;
        const render = (timestamp?: DOMHighResTimeStamp) => {

            //Debug fps

            // secondsPassed = (timestamp! - oldTimeStamp) / 1000;
            // oldTimeStamp = timestamp!;
        
            // fps = Math.round(1 / secondsPassed);
            // console.log(fps)

            //Render
            
            animationFrameId = window.requestAnimationFrame(render)
            frameCount++
            onAnimate(context!, canvas, frameCount)
            frameCount = postDraw(context!, frameCount);
        }
        render()
        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }


    }, [onAnimate, isAnimationStopped])

    return canvasRef;
}