import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../../../../../hooks/useAuth";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { FaUserCircle } from 'react-icons/fa';
import Field from "../../../../ui/field/Field";
import styles from './AuthForm.module.scss';
import styleElements from '../RightElements.module.scss';
import { Button } from "../../../../ui/button/Button";
import { useActions } from "../../../../../hooks/useActions";
import { Link } from "react-router-dom";
import { IAuthDto } from "../../../../../types/auth.interface";


export const AuthForm: FC = () => {

    const { ref, isShow, setIsShow } = useClickOutside(false);

    const {login} = useActions();
    
    const { register, formState: { errors }, handleSubmit} = useForm<IAuthDto>({
        mode: 'onChange'
    });

    const onSubmit:SubmitHandler<IAuthDto> = (data) => {  
            login(data)      
    }
   

    return (
        <div className={styles.wrapper} ref={ref}>
            <button className={styleElements.button} onClick={() => setIsShow(!isShow)}>
                <FaUserCircle />
            </button>

            { isShow
                ?
                <form className={styles.form} onSubmit={(e) => {e.preventDefault(); handleSubmit(onSubmit)()}}>
                    <Field
                        {...register('username', {
                            required: 'Please enter your username',
                           
                        })}
                        placeholder={"Your username"}             
                        error={errors.username}
                    />
                    <Field
                        {...register('password', {
                            required: 'Please enter your password',
                            minLength: {
                                value: 6,
                                message: 'At least 6 symbols'
                            }
                        })}
                        placeholder={"Your password"}                  
                        error={errors.password}
                    />
                    <div className={'mt-5 mb-1 text-center'}>
                        <Button type="submit">
                            Log in
                        </Button>
                        <Link to={'/registration'} className={styles.register}>
                            Sign Up
                        </Link>
                    </div>
                </form>
                :
                null
            }
        </div>
    )
}