import { FC } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { AuthForm } from "./auth-form/AuthForm";
import ProfileMenu from "./profile-menu/ProfileMenu";
import styles from './RightElements.module.scss';


export const RightElements: FC = () => {

    const {user} = useAuth();
    
    return (
        <div className={styles.elements}>
            {user ? <ProfileMenu /> : <AuthForm />}
        </div>
    )
}