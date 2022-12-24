import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useActions } from "../../../../../hooks/useActions";
import { packApi } from "../../../../../store/api/pack.api";
import { IPackForm, ISpriteForm } from "./pack-forms/Forms.interface";
import styles from "./pack-forms/Forms.module.scss";
import PackForm from "./pack-forms/PackForm";
import SpriteForm from "./pack-forms/SpriteForm";

export const PackAddForm: FC = () => {

    //Pack info

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue
    } = useForm<IPackForm>({ mode: "onChange" })

    const { addMsg } = useActions()
    const [createPack] = packApi.useCreatePackMutation()

    const onSubmit: SubmitHandler<IPackForm> = (data) => {
        createPack(data).unwrap().then(res => addMsg({ message: 'Pack saved', status: 200 }));
    }


    // Sprites

    const {
        register: registerSprite,
        formState: { errors: spriteErrors },
        handleSubmit: spriteHandleSubmit
    } = useForm<ISpriteForm>({ mode: 'onChange' })

    const [createSpritePack] = packApi.useCreateSpritePackMutation();

    const spriteSubmit: SubmitHandler<ISpriteForm> = (data) => {
        createSpritePack(data).unwrap().then(res => handleSpriteCreateSuccess(res.id));

    }

    const handleSpriteCreateSuccess = (id: number) => {
        setValue("packPath.id", id);
        addMsg({ message: 'Sprites saved', status: 200 })
    }

    return (
        <div className={styles.packs_forms_wrapper}>
            <h3>First provide links to sprites for each piece. After you create a sprite pack, you'll be given an id that you need to create a pack</h3>
            <SpriteForm
                form={
                    {

                        handleSubmit: spriteHandleSubmit(spriteSubmit),
                        errors: spriteErrors,
                        register: registerSprite
                    }
                }
            />
            <PackForm
                form={
                    {
                        handleSubmit: handleSubmit(onSubmit),
                        errors: errors,
                        register: register
                    }}
            />

        </div>
    )
}