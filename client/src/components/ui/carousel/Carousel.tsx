import { FC, useRef, useState } from "react";
import { IoArrowRedoOutline, IoArrowUndoOutline } from "react-icons/io5";
import { useIsMobile } from "../../../hooks/useMobile";
import { Button } from "../button/Button";
import { ICarousel } from "./Carousel.interface";
import styles from './Carousel.module.scss';


export const Carousel: FC<ICarousel> = ({ slides }) => {

    const [current, setCurrent] = useState(0);
    const { isMobile } = useIsMobile()
    const viewportRef = useRef<HTMLDivElement>(null);
    const itemsPerScreen = isMobile ? 1 : 3;

    const handleChange = (dir: 'prev' | 'next') => {
        dir === 'prev' ? setCurrent(prev => prev -= 1) : setCurrent(prev => prev += 1)
    }
    console.log(slides)
    if (viewportRef.current) viewportRef.current.style.transform = `translateX(calc(${current}* -100%))`;

    return (
        <div className={styles.carousel_container}>
            <Button
                onClick={() => handleChange('prev')}
                disabled={current === 0}
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
                disabled={current === (Math.floor((slides.length / itemsPerScreen)))}
            >
                <IoArrowRedoOutline />
            </Button>
        </div>
    )
}