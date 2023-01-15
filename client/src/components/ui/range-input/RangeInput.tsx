import { ChangeEventHandler, FC, useRef, useState } from 'react';
import { IRangeInput } from './RangeInput.interface';
import styles from './RangeInput.module.scss';

export const RangeInput: FC<IRangeInput> = ({ max, min, label, id, onRangeChange, step, defaultValue }) => {

    const [value, setValue] = useState(defaultValue);

    const spanRef = useRef<HTMLSpanElement>(null)
    const inputWrapperRef = useRef<HTMLDivElement>(null)

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        onRangeChange(e.target);

        setThumbCircle(e.target);
        setValue(Number(e.target.value));

    }

    const setThumbCircle = (input: HTMLInputElement) => {
        if (!spanRef.current || !inputWrapperRef.current) return;
        const currValue = Number(input.value)
        const newValue = Number((currValue - Number(input.min)) * 100 / (Number(input.max) - Number(input.min)));
        const { width: spanW, height: spanH } = spanRef.current.getBoundingClientRect()
        const { height: parentH } = inputWrapperRef.current.getBoundingClientRect()
        const newPosition = (spanW / 2) + (newValue * 0.2);
        spanRef.current.style.left = `calc(${newValue}% - ${newPosition}px + ${parentH}px)`;
        spanRef.current.style.top = `calc(${parentH / 2 - spanH / 2}px)`;

    }

    const onActivate = (input: HTMLInputElement) => {
        if (!spanRef.current || !inputWrapperRef.current) return;
        spanRef.current.style.display = 'block';
        setThumbCircle(input)
    }

    const onDisable = () => {
        if (!spanRef.current) return;
        spanRef.current.style.display = 'none';
    }

    return (
        <div className={styles.range_input_wrapper}>
            <label id={id}>{label}</label>
            <div className={styles.input_wrapper} ref={inputWrapperRef}>
                <input
                    type='range'
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    id={id}
                    onTouchStart={(e) => onActivate(e.currentTarget)}
                    onTouchEnd={(e) => onDisable()}
                    onMouseDown={(e) => onActivate(e.currentTarget)}
                    onMouseUp={(e) => onDisable()}
                    onMouseOut={() => onDisable()}
                    onChange={handleChange}
                >
                </input>
                <span ref={spanRef}></span>
            </div>
            <p>{Number(value) * 100}%</p>
        </div>
    )

}