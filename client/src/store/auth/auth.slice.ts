import { IUserFields } from "../../types/auth.interface"
import { createSlice } from '@reduxjs/toolkit';
import {login, register} from './auth.actions';
import { loginSpan } from "../../constants/constants";

interface IAuthInitial extends IUserFields {
    isLoading: boolean
    expirationDate: string | null;
}


const initialState: IAuthInitial = {
    user: null,
    isLoading: false,
    expirationDate: window.localStorage.getItem('tokenExp')
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.user = payload.user;
                state.expirationDate = loginSpan.toString();
                window.localStorage.setItem('tokenExp', loginSpan.toString());
            })
            .addCase(register.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.user = null;
               
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.user = payload.user;
                state.expirationDate = loginSpan.toString();
                window.localStorage.setItem('tokenExp', loginSpan.toString());

            })
            .addCase(login.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.user = null;
                
            })           
    }
})