import { FC } from 'react';
import { ICanvas } from './Canvas.interface';
import { useCanvas } from './useCanvas';


const Canvas: FC<ICanvas> = ({ onAnimate, isAnimationStopped, preDraw, ...rest }) => {

    const canvasRef = useCanvas({ onAnimate, preDraw, isAnimationStopped });
    return (
        <canvas ref={canvasRef} {...rest}>
            This element is not supported in your browser
        </canvas>
    )
}

export default Canvas