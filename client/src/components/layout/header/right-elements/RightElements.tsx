import { FC } from "react";
import { useActions } from "../../../../hooks/useActions";
import { useAuth } from "../../../../hooks/useAuth";
import { AuthForm } from "./auth-form/AuthForm";
import ProfileMenu from "./profile-menu/ProfileMenu";
import styles from './RightElements.module.scss';


export const RightElements: FC = () => {

    const {user, expirationDate} = useAuth();
    const {logout} = useActions()

    if (Number(expirationDate) < Date.now()) logout({});

    return (
        <div className={styles.elements}>
            {user ? <ProfileMenu /> : <AuthForm />}
        </div>
    )
}