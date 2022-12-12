import { Layout } from "../../../layout/Layout"
import { FC, useEffect} from 'react';
import { useActions } from "../../../../hooks/useActions";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAuthDto } from "../../../../types/auth.interface";
import RegisterForm from '../../../ui/profile-form/ProfileForm'
import styles from '../register/Register.module.scss';
import { useAuth } from "../../../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../ui/button/Button";

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

    useEffect(() => {
        if (user) navigate('/');
    }, [user])


    return (
        <Layout title="Ultimate Chess registration">
            <section className={styles.container}>
                <RegisterForm
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

        </Layout>
    )
}


export default Login;