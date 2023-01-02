import { useEffect, useState } from "react"




export const useResize = () => {

    const [currentWidth, setCurrentWidth] = useState(window.innerWidth);

    const handleResize = (e: Event) => {
        setCurrentWidth(prev => (e.target as Window).innerWidth);
    }

    useEffect(() => {

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return currentWidth;
}