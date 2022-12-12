import { ChangeEvent } from 'react';

export interface ISearch {
    handleSearch: (arg: ChangeEvent<HTMLInputElement>) => void;
    searchTerm: string;

}