import { FC } from 'react';
import { Button } from '../../../ui/button/Button';
import { Portal } from '../../../ui/portal/Portal';
import Wrapper from '../../../ui/wrapper/Wrapper';
import { SettingsComp } from '../../settings/SettingsComp';
import styles from './IngameSettings.module.scss';


export const IngameSettings: FC<{ onClose: () => void }> = ({ onClose }) => {


    return (
        <Portal>
            <div className={styles.container}>
                <Wrapper title='Audio'>
                    <SettingsComp />
                    <Button onClick={onClose}>
                        Back
                    </Button>
                </Wrapper>
            </div>

        </Portal>
    )
}