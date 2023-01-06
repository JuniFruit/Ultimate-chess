import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useActions } from '../../../../../hooks/useActions';
import { packApi } from '../../../../../store/api/pack.api';
import { Button } from '../../../../ui/button/Button';
import { IPackForm, ISpriteForm } from '../add-pack/pack-forms/Forms.interface';
import PackForm from '../add-pack/pack-forms/PackForm';
import styles from './PackEdit.module.scss';
import SpriteForm from '../add-pack/pack-forms/SpriteForm';
import { Spinner } from '../../../../ui/loading/Spinner';

const PackEdit: FC<{ id: number }> = ({ id }) => {

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<IPackForm>({ mode: "onChange" })

    const { data: pack, isLoading } = packApi.useGetPackByIdQuery(Number(id), {
        skip: !id,
    })
    const { addMsg } = useActions();

    //Pack

    const [updatePack] = packApi.useUpdatePackMutation();
    const [deletePack] = packApi.useDeletePackMutation();

    const onSubmit: SubmitHandler<IPackForm> = (data) => {
        updatePack({ ...data, id: Number(id) }).unwrap().then(res => addMsg({ message: "Pack saved", status: 200 }));
    }
    const handleDelete = () => {
        deletePack(Number(id))
            .unwrap().then(res => addMsg({ message: 'Pack deleted', status: 200 }));
    }

    //Sprite
    const {
        register: spriteRegister,
        formState: { errors: spriteErrors },
        handleSubmit: spriteHandleSubmit
    } = useForm<ISpriteForm>({ mode: "onChange" })

    const { data: spritePack } = packApi.useGetSpritePackByIdQuery(Number(pack?.packPath.id), {
        skip: !pack
    })
    const [updateSpritePack] = packApi.useUpdateSpritePackMutation();

    const onSpriteSubmit: SubmitHandler<ISpriteForm> = (data) => {
        updateSpritePack({ ...data, id: Number(pack?.packPath.id) })
            .unwrap().then(res => addMsg({ message: "Sprites saved", status: 200 }));
    }

    if (!pack || !spritePack) return null;
    if (isLoading) return <Spinner />

    return (
        <div>
            <div className={styles.buttons}>
                <Button onClick={handleDelete}> Delete</Button>
            </div>
            <SpriteForm
                form={
                    {
                        handleSubmit: spriteHandleSubmit(onSpriteSubmit),
                        register: spriteRegister,
                        errors: spriteErrors
                    }

                }
                defaultValues={spritePack}
            />
            <PackForm
                form={{
                    handleSubmit: handleSubmit(onSubmit),
                    register,
                    errors
                }}
                defaultValues={
                    {
                        ...pack,
                        name: pack.title
                    }
                }
            />
        </div>
    )

}

export default PackEdit;