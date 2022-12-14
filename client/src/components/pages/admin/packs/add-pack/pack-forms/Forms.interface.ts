import { IPack } from "../../../../../../types/pack.interface";
import { FormEventHandler } from "react";
import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { ISpritesObj } from "../../../../../../model/figures/figures.interface";

export interface ISpriteForm extends ISpritesObj {} 

export interface IPackForm extends Pick<IPack, "preview" | "sysName" | "title" > {  
    packPath: {
        id: number;
    }
}

export interface IPackUpdateForm extends IPackForm {
    id: number;
}

export interface IPackFormComponent {
    form: {
        handleSubmit: FormEventHandler;
        register: UseFormRegister<any>;
        setValue?: UseFormSetValue<IPackForm>;
        errors: FieldErrors<IPackForm>;
    },
    defaultValues?: {
        name:string;
        preview: string;
        packPath: {
            id: number
        }
        sysName: string;

    }

}