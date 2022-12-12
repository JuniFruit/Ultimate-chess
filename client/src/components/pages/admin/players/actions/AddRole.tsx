import { FC, MouseEvent } from 'react';
import { useActions } from '../../../../../hooks/useActions';
import { useClickOutside } from '../../../../../hooks/useClickOutside';
import { api } from '../../../../../store/api/api';
import { roleApi } from '../../../../../store/api/role.api';
import { Button } from '../../../../ui/button/Button';
import styles from './Actions.module.scss';



export const AddRole: FC<{ userId: number }> = ({ userId }) => {

    const { ref, isShow, setIsShow } = useClickOutside(false);
    const { data: roles } = roleApi.useGetRolesQuery(null);
    const [addRoleToUser] = api.useAddRoleToUserMutation()
    const { addMsg } = useActions()

    const handleAdd = (e: MouseEvent<HTMLButtonElement>) => {

        addRoleToUser({
            roleValue: e.currentTarget.innerHTML,
            userId
        }).unwrap().then(res => addMsg({ message: 'Role added', status: 200 }));
    }

    return (
        <div
            ref={ref}
            className={styles.wrapper}
        >
            <Button onClick={() => setIsShow(prev => !prev)}>
                Add Role
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
                                        <Button onClick={handleAdd}>
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