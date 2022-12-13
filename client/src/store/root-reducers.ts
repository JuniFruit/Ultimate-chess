import { authSlice } from "./auth/auth.slice";
import { AnyAction, combineReducers, Reducer } from '@reduxjs/toolkit';
import {api} from './api/api';
import {messageSlice} from "./message/message.slice";
import storage from "redux-persist/lib/storage";


const appReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    auth: authSlice.reducer,
    message: messageSlice.reducer
})


const rootReducer: Reducer = (state, action: AnyAction) => {
    if (action.type === 'auth/logout') {
        storage.removeItem('persist:root')
        window.localStorage.removeItem('tokenExp')
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

export default rootReducer;