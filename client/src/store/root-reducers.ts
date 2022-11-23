import { authSlice } from "./auth/auth.slice";
import { combineReducers } from '@reduxjs/toolkit';
import {api} from './api/api';


export const rootReducers = combineReducers({
    [api.reducerPath]: api.reducer,
    auth: authSlice.reducer
})