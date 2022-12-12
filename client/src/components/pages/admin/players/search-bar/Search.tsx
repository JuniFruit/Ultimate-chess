import {FC} from 'react';
import Field from '../../../../ui/field/Field';
import { ISearch } from './Search.interface';


const Search: FC<ISearch> = ({handleSearch, searchTerm}) => {
    

    
    return (
        <form onSubmit={(e) => {e.preventDefault()}}>
            <Field 
                onChange={handleSearch}
                value={searchTerm}
                type="search"
                placeholder='Player username'
            />
        </form>
    )
}

export default Search