import { useRef, useEffect } from 'react'

export const useAnimate = (callback: any) => {

    const requestRef = useRef(0);

    const animate = (frames:number) => {
        console.log(frames);
        callback();
        requestRef.current = requestAnimationFrame(animate);
    }

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
}