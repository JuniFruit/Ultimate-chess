import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useActions } from "../../../../../hooks/useActions";
import { api } from "../../../../../store/api/api";
import { IUserEdit } from "../../../../../types/user.interface";
import { validURL } from "../../../../../utils/validations.utils";
import { Button } from "../../../../ui/button/Button";
import Field from "../../../../ui/field/Field";
import { Portal } from "../../../../ui/portal/Portal";
import Wrapper from "../../../../ui/wrapper/Wrapper";
import { IEditForm } from "./EditForm.interface";
import styles from './EditForm.module.scss';

export const EditForm: FC<IEditForm> = ({ onClose, avatarLink }) => {

    const [edit] = api.useEditMutation()
    const { addMsg } = useActions()
    const { register, formState: { errors }, handleSubmit, setValue } = useForm<IUserEdit>({
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<IUserEdit> = (data) => {
        edit(data).unwrap().then(res => handleSuccess(res.avatarLink!));
    }
    const handleSuccess = (avatarLink: string) => {
        setValue("avatarLink", avatarLink);
        addMsg({ message: 'Profile saved', status: 200 })
    }





    return (
        <Portal>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <Wrapper title="Change avatar">

                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit)() }}
                        >
                            <Field
                                {...register('avatarLink', {
                                    required: 'Please provide a link to your avatar',
                                    pattern: {
                                        value: validURL,
                                        message: 'Please provide a valid link'
                                    }

                                })}
                                placeholder='URL for your avatar'
                                defaultValue={avatarLink}
                                error={errors.avatarLink}
                            />
                            <div className={styles.buttons}>
                                <Button title="Submit the form" type="submit">
                                    Save
                                </Button>
                                <Button
                                    onClick={() => onClose()}>
                                    Back
                                </Button>
                            </div>
                        </form>

                    </Wrapper>
                </div>
            </div>
        </Portal>
    )
}