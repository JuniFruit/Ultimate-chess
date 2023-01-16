import { FC } from "react";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import styles from './AuthForm.module.scss';
import styleElements from '../RightElements.module.scss';
import { Link } from "react-router-dom";
import { IoLogInOutline } from "react-icons/io5";
import { FaUserCircle } from 'react-icons/fa';

export const AuthForm: FC = () => {

    const { ref, isShow, setIsShow } = useClickOutside(false);


    return (
        <div className={styles.wrapper} ref={ref}>
            <button aria-label="login-menu" className={styleElements.button} onClick={() => setIsShow(!isShow)}>
                <FaUserCircle />
            </button>

            {isShow
                ?
                <div className={styles.menu}>
                    <ul>
                        <li>
                            <Link to={`/login`}><IoLogInOutline /> Login</Link>
                        </li>
                    </ul>
                </div>

                :
                null
            }
        </div>
    )
}