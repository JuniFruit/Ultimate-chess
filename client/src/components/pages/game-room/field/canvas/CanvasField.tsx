import Canvas from "./canvas-component/Canvas"
import { FC } from 'react';
import { ICanvasField } from "./CanvasField.interface";
import { useCanvasField } from "./useCanvaseField";
import styles from '../Field.module.scss';

const CanvasField: FC<ICanvasField> = (props) => {

    const { canvas, handlers } = useCanvasField(props);

    return (
        <div className={styles.board}>
            <Canvas
                onAnimate={() => { }}
                preDraw={canvas.handlePreDraw}
                className={styles.canvas}
                isAnimationStopped={true}
                key={'background'}
            />
            <Canvas
                onAnimate={canvas.draw}
                preDraw={() => { }}
                onTouchStart={handlers.handleTouchStart}
                onTouchMove={handlers.handleTouchMove}
                onTouchEnd={handlers.handleTouchEnd}
                onMouseDown={handlers.handleMouseDown}
                onMouseMove={handlers.handleMouseMove}
                onMouseOut={handlers.handleMouseOut}
                onMouseUp={handlers.handleMouseUp}
                className={styles.canvas}
                isAnimationStopped={false}
                key={'main'}
            />
        </div>
    )
}

export default CanvasField