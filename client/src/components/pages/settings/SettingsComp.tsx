import { FC, useContext, useEffect } from "react";
import { AudioCtx } from "../../../audio-engine/audio.provider";
import { DefaultSettings } from "../../../audio-engine/audio.settings";
import { AudioContextType } from "../../../audio-engine/audio.types";
import { getUserAudioSettings } from "../../../utils/general.utils";
import { RangeInput } from "../../ui/range-input/RangeInput";
import styles from './Settings.module.scss';

export const SettingsComp: FC = () => {

    const { changeGain, fetchSound } = useContext(AudioCtx) as AudioContextType;

    const handleChangeGain = (target: HTMLInputElement) => {
        const { id, value } = target;
        changeGain(id as any, Number(value))
    }

    useEffect(() => {
        fetchSound('take')
        fetchSound('firstblood');
    }, [])

    return (
        <div className={styles.wrapper}>
            <RangeInput
                min={0}
                max={1}
                step={0.1}
                label={'Master'}
                id={'master'}
                onRangeChange={handleChangeGain}
                defaultValue={getUserAudioSettings("masterGain") !== null
                    ? Number(getUserAudioSettings("masterGain")) : DefaultSettings.master}
                key='master'
            />
            <RangeInput
                min={0}
                max={1}
                step={0.1}
                label={'Sounds'}
                id={'FX'}
                onRangeChange={handleChangeGain}
                defaultValue={getUserAudioSettings("FXGain") !== null
                    ? Number(getUserAudioSettings("FXGain")) : DefaultSettings.fx}
                key='fx'
            />
            <RangeInput
                min={0}
                max={1}
                step={0.1}
                label={'Announcer'}
                id={'announce'}
                onRangeChange={handleChangeGain}
                defaultValue={getUserAudioSettings("announceGain") !== null
                    ? Number(getUserAudioSettings("announceGain")) : DefaultSettings.announce}
                key='announce'
            />

        </div>
    )
}