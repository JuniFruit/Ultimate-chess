import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { rootActions } from '../store/root-action';


export const useActions = () => {

    const dispatch = useDispatch();
    return bindActionCreators(rootActions, dispatch);
}