import { Portal } from "@headlessui/react";
import { FC } from "react";
import { Button } from "../../../../ui/button/Button";
import MatchInfo from "../main/MatchInfo";
import { IMatchInfo } from "../main/MatchInfo.interface";

import styles from './MatchInfoMobile.module.scss';

interface IMatchInfoMobile extends IMatchInfo {
    onClose: () => void
}

const MatchInfoMobile: FC<IMatchInfoMobile> = ({ onClose, ...rest }) => {

    return (
        <Portal>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <MatchInfo {...{ ...rest }} />
                    <Button
                        onClick={() => onClose()}
                    >
                        Close
                    </Button>

                </div>
            </div>
        </Portal>
    )
}

export default MatchInfoMobile;