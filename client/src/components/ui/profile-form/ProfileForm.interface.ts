import { FormEventHandler } from "react";
import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { IRegisterDto } from "../../../types/auth.interface";


export interface IProfileForm {
    form: {
        handleSubmit: FormEventHandler;
        register: UseFormRegister<any>;
        setValue: UseFormSetValue<any>;
        errors: FieldErrors<IRegisterDto>
        control: Control<any>;
    }
    title?: string;
    fieldsToExclude?: {
        avatar?: 'avatar'
        password?: 'password'
        email?: 'email'
        username?: 'username'
    }
    buttonTitle?: string;
    defaultValues?: {
        name?: string;
        avatar?: string;
        description?: string;
        username?: string;
    }
}