import { useEffect, useState } from 'react';

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
    const [isLaptopSmall, setIsLaptopSmall] = useState(window.innerHeight < 1200)

    useEffect(() => {
        const updateSize = (): void => {

            setIsMobile(window.innerWidth < 768);
            setIsLaptopSmall(window.innerHeight < 1200)
        };
        window.addEventListener('resize', updateSize);

        return (): void => window.removeEventListener('resize', updateSize);
    }, [isMobile]);

    return {isMobile, isLaptopSmall};
};

