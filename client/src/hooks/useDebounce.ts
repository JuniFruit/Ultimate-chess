import { useEffect, useState } from "react"



export const useDebounce = <T>(value:T, delay = 50): T => {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        
        let timeout = setTimeout(() => {
            setDebounced(value)
        }, delay)

        return () => {
            clearTimeout(timeout);
        }

    }, [value, delay])

    return debounced
}