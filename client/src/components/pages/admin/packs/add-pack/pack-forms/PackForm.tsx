import { FC } from 'react';
import { notEmpty, validURL } from '../../../../../../utils/validations.utils';
import { Button } from '../../../../../ui/button/Button';
import Field from '../../../../../ui/field/Field';
import { IPackFormComponent } from './Forms.interface';
import styles from './Forms.module.scss';

const ERR_MSG = 'Cannot be empty or include whitespaces'

const PackForm: FC<IPackFormComponent> = ({ form: { register, handleSubmit, errors }, defaultValues }) => {


    return (
        <form
            className={styles.form_wrapper}
            onSubmit={(e) => { e.preventDefault(); handleSubmit(e) }}>
            <Field
                {...register("title", {
                    required: "Please enter a name for the pack",
                    pattern: {
                        value: notEmpty,
                        message: ERR_MSG
                    }
                })}
                placeholder={'Pack name'}
                title={'Name'}
                error={errors.title}
                defaultValue={defaultValues?.name}
            />
            <Field
                {...register("sysName", {
                    required: "Please enter a system name for the pack",
                    pattern: {
                        value: notEmpty,
                        message: ERR_MSG
                    }
                })}
                placeholder={'System name'}
                title={'System name'}

                error={errors.sysName}
                defaultValue={defaultValues?.sysName}
            />
            <Field
                {...register("preview", {
                    required: "Please provide a preview link",
                    pattern: {
                        value: validURL,
                        message: 'Please provide a valid link'
                    }
                })}
                placeholder={'Pack preview link'}
                title={'Preview'}

                error={errors.preview}
                defaultValue={defaultValues?.preview}
            />
            <Field
                {...register("packPath.id", {
                    required: "Please provide ID of sprite pack",
                    pattern: {
                        value: notEmpty,
                        message: ERR_MSG
                    }
                })}
                placeholder={'Sprite pack id'}
                title={'Path'}

                error={errors.packPath?.id}
                defaultValue={defaultValues?.packPath.id}
            />
            <div className={styles.buttons}>
                <Button>
                    Save a pack
                </Button>
            </div>
        </form>
    )
}

export default PackForm;