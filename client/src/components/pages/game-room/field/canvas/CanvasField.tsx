import Canvas from "./canvas-component/Canvas"
import { FC } from 'react';
import { ICanvasField } from "./CanvasField.interface";
import { useCanvasField } from "./useCanvaseField";
import styles from '../Field.module.scss';

const CanvasField: FC<ICanvasField> = (props) => {

    const { canvas, mouse } = useCanvasField(props);

    return (
        <div className={styles.board}>
            <Canvas
                onAnimate={() => { }}
                preDraw={canvas.handlePreDraw}
                postDraw={canvas.handlePostDraw}
                className={styles.canvas}
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
                className={styles.canvas}
                isAnimationStopped={false}
                key={'main'}
            />
        </div>
    )
}

export default CanvasField