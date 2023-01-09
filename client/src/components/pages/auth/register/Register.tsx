import { FC, useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useActions } from "../../../../hooks/useActions";
import { useAuth } from "../../../../hooks/useAuth";
import { Layout } from "../../../layout/Layout"
import RegisterForm from "../../../ui/profile-form/ProfileForm";
import { IRegisterDto } from "../../../../types/auth.interface";
import styles from './Register.module.scss';

const RegisterPage: FC = () => {

    const { user } = useAuth()
    const { register: registerAction } = useActions();
    const navigate = useNavigate()

    useEffect(() => {
        if (user) navigate('/');
    }, [user])

    const {
        formState: { errors },
        register,
        control,
        handleSubmit,
        setValue,
    } = useForm<IRegisterDto>({
        mode: 'onChange'
    })

    const onSubmit: SubmitHandler<IRegisterDto> = (data) => {
        console.log(data);
        registerAction(data)
    }

    return (

        <Layout title="Ultimate Chess registration">
            <section className={styles.container}>
                <RegisterForm
                    form={{
                        handleSubmit: handleSubmit(onSubmit),
                        setValue,
                        control,
                        register,
                        errors
                    }}
                    title={"Please fill out fields to register an account"}
                    buttonTitle="Create account"
                    buttons={[<Link key={'/login'} className={styles.link} to={'/login'}>Log In</Link>]}
                />
            </section>

        </Layout>
    )
}

export default RegisterPage