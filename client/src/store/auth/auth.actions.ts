import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../../services/auth.service";
import { IAuthDto, IRegisterDto, IUserFields } from "../../types/auth.interface";
import messageActions from "../message/message.slice";

const {addMsg} = messageActions;
export const login = createAsyncThunk<any, IAuthDto>('auth/login', async(data, thunkAPI) => {
    try {
        const response = await AuthService.login(data);
        
        thunkAPI.dispatch(addMsg({message: 'Login successful', status: 200}))
        return response
    } catch (error:any) {
        thunkAPI.dispatch(addMsg({message: error.response.data.message, status: error.response.status}))
        thunkAPI.rejectWithValue(error);
    }
})

export const register = createAsyncThunk<any, IRegisterDto>('auth/register', async(data, thunkAPI) => {
    try {
        const response = await AuthService.register(data);
        thunkAPI.dispatch(addMsg({message: 'Registration successful', status: 200}))
        return response
    } catch (error:any) {
        thunkAPI.dispatch(addMsg({message: error.response.data.message, status: error.response.status}))
        thunkAPI.rejectWithValue(error);
    }
})


export const logout = createAsyncThunk<any, any>('auth/logout', async({}, thunkAPI) => {
    
    return {};
})