import { FC, MouseEvent } from 'react';
import { useActions } from '../../../../../hooks/useActions';
import { useClickOutside } from '../../../../../hooks/useClickOutside';
import { api } from '../../../../../store/api/api';
import { Button } from '../../../../ui/button/Button';
import { IDeleteRole } from './Actions.interface';
import styles from './Actions.module.scss';



export const DeleteRole: FC<IDeleteRole> = ({ userId, roles }) => {

    const { ref, isShow, setIsShow } = useClickOutside(false);
    const [deleteRoleFromUser] = api.useDeleteRoleFromUserMutation()
    const { addMsg } = useActions()

    const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {

        deleteRoleFromUser({
            roleValue: e.currentTarget.innerHTML,
            userId
        }).unwrap().then(res => addMsg({ message: 'Role deleted', status: 200 }));
    }

    return (
        <div
            ref={ref}
            className={styles.wrapper}
        >
            <Button onClick={() => setIsShow(prev => !prev)}>
                Delete Role
            </Button>
            {isShow
                ?
                <div className={styles.menu}>
                    <ul>
                        {
                            roles?.length
                                ?
                                roles.map(item => (
                                    <li key={`${userId} ${item.description}`}>
                                        <Button onClick={handleDelete}>
                                            {item.role}
                                        </Button>
                                    </li>
                                ))
                                : null
                        }
                    </ul>
                </div>

                :
                null
            }
        </div>
    )
}