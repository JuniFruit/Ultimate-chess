import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../../services/auth.service";
import { IAuthDto, IRegisterDto, IUserFields } from "../../types/auth.interface";


export const login = createAsyncThunk<any, IAuthDto>('auth/login', async(data, thunkAPI) => {
    try {
        const response = await AuthService.login(data);
        return response
    } catch (error) {
        thunkAPI.rejectWithValue(error);
    }
})

export const register = createAsyncThunk<any, IRegisterDto>('auth/register', async(data, thunkAPI) => {
    try {
        const response = await AuthService.register(data);
        return response
    } catch (error) {
        thunkAPI.rejectWithValue(error);
    }
})


export const logout = createAsyncThunk<any, any>('auth/logout', async({}, thunkAPI) => {
    return {};
})