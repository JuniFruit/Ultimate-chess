import { Layout } from "../../layout/Layout"
import { FC, useContext } from 'react';
import Wrapper from "../../ui/wrapper/Wrapper";
import { AudioCtx } from "../../../audio-engine/audio.provider";
import { AudioContextType } from "../../../audio-engine/audio.types";
import { DefaultSettings } from "../../../audio-engine/audio.settings";
import styles from './Settings.module.scss';
import { RangeInput } from "../../ui/range-input/RangeInput";

const Settings: FC = () => {  
    const { playSound, changeFXGain, changeMasterGain, playMasterSound } = useContext(AudioCtx) as AudioContextType;

    const handleChangeGain = (target: HTMLInputElement) => {

        const { id } = target;
        const value = Number(target.value);
        switch (id) {
            case 'master':
                playMasterSound();
                changeMasterGain(value);
                window.localStorage.setItem("masterGain", value.toString())
                break;
            case 'FX':
                playSound('castle');
                changeFXGain(value);
                window.localStorage.setItem("FXGain", value.toString())
                break;
            default:
                return;
        }

    }


    return (
        <Layout title="Ultimate Chess Audio Settings">
            <Wrapper title="Audio Settings">
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

                </div>
            </Wrapper>
        </Layout >
    )
}

export default Settings;