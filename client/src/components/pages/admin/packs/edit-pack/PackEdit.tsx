import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { useActions } from '../../../../../hooks/useActions';
import { packApi } from '../../../../../store/api/pack.api';
import { AdminPanel } from '../../../../ui/admin/main/AdminPanel';
import { Button } from '../../../../ui/button/Button';
import { useAdminAuth } from '../../../../../hooks/useAdminAuth';
import { IPackForm } from '../add-pack/pack-forms/Forms.interface';
import PackForm from '../add-pack/pack-forms/PackForm';
import styles from './PackEdit.module.scss';

const PackEdit: FC = () => {
    useAdminAuth();

    const { id } = useParams()
    const { register, formState: { errors }, handleSubmit, setValue } = useForm<IPackForm>({
        mode: "onChange"
    })

    const { data: pack } = packApi.useGetPackByIdQuery(Number(id), {
        skip: !id,
    })
    const { addMsg } = useActions();

    const [updatePack] = packApi.useUpdatePackMutation();
    const [deletePack] = packApi.useDeletePackMutation();

    const onSubmit: SubmitHandler<IPackForm> = (data) => {
        updatePack({ ...data, id: Number(id) }).unwrap().then(res => addMsg({ message: "Pack saved", status: 200 }));
    }
    const handleDelete = () => {
        deletePack(Number(id)).unwrap().then(res => addMsg({ message: 'Pack deleted', status: 200 }));
    }
    console.log(errors);
    if (!pack) return null;
    return (
        <AdminPanel title='Edit Pack'>
            <div>
                <div className={styles.buttons}>
                    <Link to="/admin/packs">List</Link>
                    <Button onClick={handleDelete}> Delete</Button>
                </div>
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
        </AdminPanel>
    )

}

export default PackEdit;