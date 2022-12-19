import { FC } from "react";
import { Button } from "../button/Button";
import Field from "../field/Field";
import { IProfileForm } from "./ProfileForm.interface";
import Wrapper from '../wrapper/Wrapper';
import styles from './ProfileForm.module.scss';

const ProfileForm: FC<IProfileForm> = ({ form, title, fieldsToExclude, buttonTitle, buttons }) => {

    return (
        <Wrapper title={title!}>
               
                <form className={styles.form_box} onSubmit={form.handleSubmit}>
                    {!fieldsToExclude?.email && <div>
                        <Field
                            {...form.register('username', {
                                required: 'Please enter your username',

                            })}
                            placeholder='Username'
                            error={form.errors.username}
                        />
                    </div>}


                    {!fieldsToExclude?.password && <div>
                        <Field
                            {...form.register('password', {
                                required: 'Please enter your password',
                                minLength: {
                                    value: 6,
                                    message: 'At least 6 characters'
                                }
                            })}
                            placeholder='Password'
                            error={form.errors.password}
                        />
                    </div>}

                    {!fieldsToExclude?.avatar && <div>
                        <Field
                            {...form.register('avatarLink')}
                            placeholder="URL for your avatar"
                        />

                    </div>}
                    <div className={styles.buttons}>
                        <Button title="Submit the form" type="submit">
                            {buttonTitle || 'Submit'}
                        </Button>
                        <>
                            {buttons?.length ? buttons.map(item => item) : null}
                        </>
                    </div>

                </form>
        </Wrapper>
    )
}

export default ProfileForm