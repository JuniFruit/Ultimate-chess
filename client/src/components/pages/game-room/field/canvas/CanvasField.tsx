import Canvas from "./canvas-component/Canvas"
import { FC } from 'react';
import { ICanvasField } from "./CanvasField.interface";
import { useCanvasField } from "./useCanvaseField";


const CanvasField: FC<ICanvasField> = (props) => {

    const { canvas, mouse } = useCanvasField(props);

    return (
        <>
            <Canvas
                onAnimate={() => { }}
                preDraw={canvas.handlePreDraw}
                postDraw={canvas.handlePostDraw}
                className={props.className}
                isAnimationStopped={true}
                key={'background'}
            />
            <Canvas
                onAnimate={canvas.draw}
                preDraw={() => { }}
                postDraw={canvas.handlePostDraw}
                onMouseMove={mouse.handleMouseMove}
                onMouseDown={mouse.handleMouseDown}
                onMouseUp={mouse.handleMouseUp}
                onMouseOut={mouse.handleMouseOut}
                className={props.className}
                isAnimationStopped={false}
                key={'main'}
            />
        </>
    )
}

export default CanvasField