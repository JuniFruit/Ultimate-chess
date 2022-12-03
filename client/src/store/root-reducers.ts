import { authSlice } from "./auth/auth.slice";
import { combineReducers } from '@reduxjs/toolkit';
import {api} from './api/api';
import {messageSlice} from "./message/message.slice";


export const rootReducers = combineReducers({
    [api.reducerPath]: api.reducer,
    auth: authSlice.reducer,
    message: messageSlice.reducer
})