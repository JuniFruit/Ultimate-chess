import { FieldError } from "react-hook-form";
import { InputHTMLAttributes } from 'react';


export interface IFieldProps {
    error?: FieldError
}

type InputPropsField = InputHTMLAttributes<HTMLInputElement> & IFieldProps

export interface IField extends InputPropsField {}