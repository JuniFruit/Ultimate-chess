import { useDebounce } from "./useDebounce"
import { ChangeEvent, useState } from "react"
import { api } from "../store/api/api";


export const useSearch = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const debounced = useDebounce(searchTerm, 500);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }

    const { isSuccess, data } = api.useGetBySearchTermQuery(searchTerm, {
        skip: !debounced
    });

    return {
        handleSearch,
        searchTerm,
        data,
        isSuccess
    }
}