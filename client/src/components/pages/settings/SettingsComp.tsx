import { FC, useContext } from "react";
import { AudioCtx } from "../../../audio-engine/audio.provider";
import { DefaultSettings } from "../../../audio-engine/audio.settings";
import { AudioContextType } from "../../../audio-engine/audio.types";
import { RangeInput } from "../../ui/range-input/RangeInput";
import styles from './Settings.module.scss';

export const SettingsComp: FC = () => {

    const { changeGain } = useContext(AudioCtx) as AudioContextType;

    const handleChangeGain = (target: HTMLInputElement) => {
        const { id, value } = target;
        changeGain(id as any, Number(value))
    }

    return (
        <div className={styles.wrapper}>
            <RangeInput
                min={0}
                max={1}
                step={0.1}
                label={'Master'}
                id={'master'}
                onRangeChange={handleChangeGain}
                defaultValue={Number(window.localStorage.getItem("masterGain")) || DefaultSettings.master}
                key='master'
            />
            <RangeInput
                min={0}
                max={1}
                step={0.1}
                label={'Sounds'}
                id={'FX'}
                onRangeChange={handleChangeGain}
                defaultValue={Number(window.localStorage.getItem("FXGain")) || DefaultSettings.fx}
                key='fx'
            />
            <RangeInput
                min={0}
                max={1}
                step={0.1}
                label={'Announcer'}
                id={'announce'}
                onRangeChange={handleChangeGain}
                defaultValue={Number(window.localStorage.getItem("announceGain")) || DefaultSettings.announce}
                key='announce'
            />

        </div>
    )
}