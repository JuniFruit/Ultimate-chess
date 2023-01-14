import { FC, useState } from 'react'
import { mockups } from '../../../../assets/mockups/images';
import { ROLES } from '../../../../constants/constants';
import { useAuth } from '../../../../hooks/useAuth';
import { Button } from '../../../ui/button/Button';
import { ImagePreview } from '../../../ui/SuspenseWrapper';
import { StatColumnItem } from '../../../ui/user/stat/StatColumn'
import { EditForm } from './edit/EditForm';
import { IProfileHeader } from './ProfileHeader.interface'
import styles from './ProfileHeader.module.scss';

export const ProfileHeader: FC<IProfileHeader> = ({ avatarLink, lossesCount, winsCount, username, roles }) => {

    const [isFromOpen, setIsFormOpen] = useState(false);

    const { user } = useAuth()
    const isSameUser = user.username === username;

    return (
        <>
            <div className={styles.header_wrapper}>
                <Button
                    onClick={() => setIsFormOpen(true)}
                    disabled={!isSameUser}
                    >
                    <ImagePreview imageSrc={avatarLink || mockups.defaultAvatar} />
                </Button>
                <div className={styles.header_user_info}>
                    <div className={styles.user}>
                        <h2>{username}</h2>
                        <div className={styles.roles}>
                            {roles.length
                                ?
                                roles.map(item => (<span key={item.role}>{(ROLES as any)[item.role]}</span>))
                                : null
                            }

                        </div>
                    </div>
                    <div className={styles.header_stats}>
                        <StatColumnItem
                            valueTitle='Victories'
                            value={winsCount}
                            key='Victories'
                        />
                        <StatColumnItem
                            valueTitle='Defeats'
                            value={lossesCount}
                            key='Defeats'
                        />
                    </div>
                </div>
            </div>
            {isFromOpen && isSameUser ? <EditForm onClose={() => setIsFormOpen(false)} avatarLink={avatarLink} /> : null}
        </>
    )
}