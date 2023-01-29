import { FC, lazy } from "react";
import { useActions } from "../../../../hooks/useActions";
import { useAuth } from "../../../../hooks/useAuth";
import styles from './RightElements.module.scss';

const ProfileMenu = lazy(() => import("./profile-menu/ProfileMenu"));
const AuthForm = lazy(() => import("./auth-form/AuthForm"));

const RightElements: FC = () => {

    const { user, expirationDate } = useAuth();
    const { logout } = useActions()

    if (expirationDate && Number(expirationDate) < Date.now()) logout(null);

    return (
        <div className={styles.elements}>
            {user ? <ProfileMenu /> : <AuthForm />}
        </div>
    )
}

export default RightElements