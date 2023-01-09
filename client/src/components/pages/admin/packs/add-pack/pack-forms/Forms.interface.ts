import { FormEventHandler } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { ISpritesObj } from "../../../../../../model/figures/figures.interface";
import { IPack } from "../../../../../../types/pack.interface";

export interface ISpriteForm extends ISpritesObj {
    id: number;
 }

export interface IPackForm extends Pick<IPack, "preview" | "sysName" | "title"> {
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
        name: string;
        preview: string;
        packPath: {
            id: number
        }
        sysName: string;

    }

}

export interface ISpriteFormComponent {
    form: {
        handleSubmit: FormEventHandler;
        register: UseFormRegister<any>;
        setValue?: UseFormSetValue<ISpriteForm>;
        errors: FieldErrors<ISpriteForm>;
    },
    defaultValues?: ISpritesObj;
}