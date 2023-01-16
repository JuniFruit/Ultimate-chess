import { FC, useState, useRef } from "react";
import { Button } from "../button/Button";
import { ICarousel } from "./Carousel.interface";
import styles from './Carousel.module.scss';
import { useIsMobile } from "../../../hooks/useMobile";
import { IoArrowRedoOutline, IoArrowUndoOutline } from "react-icons/io5";


export const Carousel: FC<ICarousel> = ({ slides }) => {

    const [current, setCurrent] = useState(0);
    const { isMobile } = useIsMobile()
    const viewportRef = useRef<HTMLDivElement>(null);
    const itemsPerScreen = isMobile ? 1 : 3;

    const handleChange = (dir: 'prev' | 'next') => {
        dir === 'prev' ? setCurrent(prev => prev -= 1) : setCurrent(prev => prev += 1)
    }

    if (viewportRef.current) viewportRef.current.style.transform = `translateX(calc(${current}* -100%))`;

    return (
        <div className={styles.carousel_container}>
            <Button
                onClick={() => handleChange('prev')}
                disabled={current === -1}
                aria-label={'previous slide'}
                className={styles.nav_button}>
                
                <IoArrowUndoOutline />
            </Button>
            <div className={styles.carousel_overlay}>
                <div className={styles.carousel_viewport} ref={viewportRef} >
                    {slides.map(slide => slide)}

                </div>
            </div>
            <Button
                onClick={() => handleChange('next')}
                className={styles.nav_button}
                aria-label={'next slide'}
                disabled={current === (Math.floor((slides.length / itemsPerScreen) - 1))}>
                <IoArrowRedoOutline />
            </Button>
        </div>
    )
}