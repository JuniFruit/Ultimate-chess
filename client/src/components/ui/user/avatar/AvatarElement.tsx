import { FC, memo } from "react";
import { mockups } from "../../../../assets/mockups/images";
import styles from './Avatar.module.scss';

const AvatarElement: FC<{avatarPath?:string}> = memo(({avatarPath}) => {

    return (
        <div className={styles.avatar}>
            <img
                src={avatarPath || mockups.defaultAvatar}
                alt={'avatar'}
                onError={(e:any) => {e.target.onerror = null; e.target.src = mockups.defaultAvatar}}
            />
        </div>
    )
}) 

export default AvatarElement