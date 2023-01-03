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
                onMouseMove={handlers.handleMouseMove}
                onMouseDown={handlers.handleMouseDown}
                onMouseUp={handlers.handleMouseUp}
                onMouseOut={handlers.handleMouseOut}
                onTouchStart={handlers.handleTouchStart}
                onTouchEnd={handlers.handleTouchEnd}
                onTouchMove={handlers.handleTouchMove}
                className={styles.canvas}
                isAnimationStopped={false}
                key={'main'}
            />
        </div>
    )
}

export default CanvasField