import { FC, useState } from "react";
import { Controller } from "react-hook-form";
import { Button } from "../button/Button";
import Field from "../field/Field";
import AvatarElement from "../user/avatar/AvatarElement";
import { IProfileForm } from "./ProfileForm.interface";
import styles from './ProfileForm.module.scss';

const ProfileForm: FC<IProfileForm> = ({ form, title, fieldsToExclude, buttonTitle, defaultValues }) => {
    const [avatarPath, setAvatarPath] = useState('');

    return (
        <div className={styles.wrapper}>

            <h1>{title}</h1>
            <form className={styles.form_box} onSubmit={form.handleSubmit}>
                {!fieldsToExclude?.email && <div>
                    <Field
                        {...form.register('username', {
                            required: 'Please enter your username',
                            
                        })}
                        placeholder='Email'
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
                        {...form.register('avatarLink') }
                        placeholder="URL for your avatar"
                    />                  

                </div>}
                <div>
                    <Button title="Submit the form">
                        {buttonTitle || 'Submit'}
                    </Button>
                </div>

            </form>
        </div>
    )
}

export default ProfileForm