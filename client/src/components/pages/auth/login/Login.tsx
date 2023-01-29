import { FC, useEffect } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useActions } from "../../../../hooks/useActions";
import { useAuth } from "../../../../hooks/useAuth";
import { IAuthDto } from "../../../../types/auth.interface";
import { setTabTitle } from "../../../../utils/general.utils";
import { ProfileForm } from "../../../ui/SuspenseWrapper";
import styles from '../register/Register.module.scss';

const Login: FC = () => {

    const { login } = useActions();
    const { user } = useAuth()

    const { register, formState: { errors }, handleSubmit, setValue, control } = useForm<IAuthDto>({
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<IAuthDto> = (data) => {
        login(data)
    }

    const navigate = useNavigate()
    setTabTitle("Ultimate Chess registration");
    useEffect(() => {
        if (user) navigate('/');
    }, [user])


    return (
        <section className={styles.container}>
            <ProfileForm
                form={{
                    handleSubmit: handleSubmit(onSubmit),
                    setValue,
                    control,
                    register,
                    errors,

                }}
                fieldsToExclude={{
                    avatar: 'avatar'
                }}
                title={"Please enter your username and password to log in"}
                buttonTitle="Log in"
                buttons={[<Link key={'/register'} className={styles.link} to={'/registration'}>Sign Up</Link>]}
            />
        </section>

    )
}


export default Login;