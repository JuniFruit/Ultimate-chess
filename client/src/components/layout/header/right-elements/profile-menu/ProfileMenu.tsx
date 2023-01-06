import { FC } from "react";
import { Link } from "react-router-dom";
import { useActions } from "../../../../../hooks/useActions";
import { useAuth } from "../../../../../hooks/useAuth";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { IoChevronUp, IoChevronDown } from 'react-icons/io5'
import { api } from "../../../../../store/api/api";
import styles from './ProfileMenu.module.scss';
import { useIsMobile } from "../../../../../hooks/useMobile";
import AvatarElement from "../../../../ui/user/avatar/AvatarElement";

const ProfileMenu: FC = () => {

    const { user } = useAuth();

    const { data } = api.useGetProfileQuery(null, {
        skip: !user
    });
    const { logout } = useActions()
    const { ref, isShow, setIsShow } = useClickOutside(false);
    const { isMobile } = useIsMobile();

    const isAdmin = data?.roles.some(item => item.role === "ADMIN" || item.role === "CREATOR" );

    return (
        <div ref={ref} className={styles.wrapper}>

            <button onClick={(e) => { e.preventDefault(); setIsShow(!isShow) }}>
                <AvatarElement
                    avatarPath={data?.avatarLink}
                />
                {!isMobile && <span>
                    {data?.username || ''}
                </span>}
                {isShow ? <IoChevronUp className={styles.icon} /> : <IoChevronDown className={styles.icon} />}
            </button>
            {isShow
                ?
                <div className={styles.menu}>
                    <ul>
                        <li>
                            <Link to={`/user/${user?.id}`}>My Profile</Link>
                        </li>
                        <li>
                            {isAdmin ? <Link to={`/admin`}>Admin Panel</Link> : null}
                        </li>
                        <li>
                            <button onClick={() => logout(null)}>Logout</button>
                        </li>
                    </ul>
                </div>
                :
                null
            }
        </div>
    )
}

export default ProfileMenu;