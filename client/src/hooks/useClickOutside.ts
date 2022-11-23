import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface ReturnHook {
    ref: any;
    isShow: boolean;
    setIsShow: Dispatch<SetStateAction<boolean>>;
}

export const useClickOutside = (isVisisble: boolean): ReturnHook => {
    const [isShow, setIsShow] = useState(isVisisble);

    const ref = useRef<HTMLElement>(null);

    const handleClickOutside = (event:any) => {
        if (ref.current && !ref.current.contains(event.target)) setIsShow(false);

    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, [isShow])

    return {ref, isShow, setIsShow}
}