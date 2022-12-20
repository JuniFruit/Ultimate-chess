import { FC } from 'react'
import { mockups } from '../../../../assets/mockups/images';
import { ROLES } from '../../../../constants/constants';
import { ImagePreview } from '../../../ui/image-preview/ImagePreview'
import { StatColumnItem } from '../../../ui/user/stat/StatColumn'
import { IProfileHeader } from './ProfileHeader.interface'
import styles from './ProfileHeader.module.scss';

export const ProfileHeader: FC<IProfileHeader> = ({ avatarLink, lossesCount, winsCount, username, roles }) => {


    return (
        <div className={styles.header_wrapper}>
            <ImagePreview imageSrc={avatarLink || mockups.defaultAvatar} />
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
    )
}