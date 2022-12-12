import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useActions } from "../../../../../hooks/useActions";
import { packApi } from "../../../../../store/api/pack.api";
import { IPackForm } from "./pack-forms/Forms.interface";
import styles from "./pack-forms/Forms.module.scss";
import PackForm from "./pack-forms/PackForm";
import SpriteForm from "./pack-forms/SpriteForm";

export const PackAddForm: FC = () => {

    const { register, formState: { errors }, handleSubmit, setValue } = useForm<IPackForm>({ mode: "onChange" })

    const handleSpriteCreateSuccess = (id: number) => {
        setValue("packPath.id", id);
        addMsg({message: 'Sprites saved', status: 200})
    }

    const {addMsg} = useActions()
    const [createPack] = packApi.useCreatePackMutation()

    const onSubmit: SubmitHandler<IPackForm> = (data) => {
        createPack(data).unwrap().then(res => addMsg({message: 'Pack saved', status: 200}));
    }

    return (
        <div className={styles.packs_forms_wrapper}>
            <h3>First provide links to sprites for each piece. After you create a sprite pack, you'll be given an id that you need to create a pack</h3>
            <SpriteForm
                onSuccess={handleSpriteCreateSuccess}
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