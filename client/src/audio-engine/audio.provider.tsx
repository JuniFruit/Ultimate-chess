import { createContext, FC, PropsWithChildren, useRef } from 'react';
import { Sounds, UltimateSounds } from './audio.data';
import { AudioService } from './audio.service';
import { DefaultSettings } from './audio.settings';
import { AudioContextType, ISoundBuffers, sound } from './audio.types';

const ctx = new window.AudioContext()

const masterGain = ctx.createGain();
masterGain.gain.value = Number(window.localStorage.getItem("masterGain")) >= 0
    ? Number(window.localStorage.getItem("masterGain")) : DefaultSettings.master;
masterGain.connect(ctx.destination);

const soundsGain = ctx.createGain();
soundsGain.gain.value = Number(window.localStorage.getItem("FXGain")) >= 0
    ? Number(window.localStorage.getItem("FXGain")) : DefaultSettings.fx;
soundsGain.connect(masterGain);

const announceGain = ctx.createGain();
announceGain.gain.value = Number(window.localStorage.getItem("announceGain")) >= 0
    ? Number(window.localStorage.getItem("announceGain")) : DefaultSettings.announce;
announceGain.connect(masterGain);


export const AudioCtx = createContext<AudioContextType | null>(null);

const AudioProvider: FC<PropsWithChildren> = ({ children }) => {

    const soundBuffers = useRef<ISoundBuffers>({});

    const fetchMainSounds = () => {
        for (let [sound, link] of Object.entries(Sounds)) {
            if ((soundBuffers.current as any)[sound]) return;
            AudioService.fetchAudio(link)
                .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
                .then(audioBuffer => (soundBuffers.current as any)[sound] = audioBuffer)
                .catch(e => console.log(e));
        }
    }

    const fetchUltimateSounds = () => {
        for (let [sound, link] of Object.entries(UltimateSounds)) {
            if ((soundBuffers.current as any)[sound]) return;

            AudioService.fetchAudio(link)
                .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
                .then(audioBuffer => (soundBuffers.current as any)[sound] = audioBuffer)
                .catch(e => console.log(e));
        }
    }

    const fetchSound = (sound: sound, isUltimate = false) => {
        if ((soundBuffers.current as any)[sound]) return;
        console.log(soundBuffers)
        let link = isUltimate ? (UltimateSounds as any)[sound] : (Sounds as any)[sound];
        AudioService.fetchAudio(link)
            .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
            .then(audioBuffer => (soundBuffers.current as any)[sound] = audioBuffer)
            .catch(e => console.log(e));
    }


    const _playbackFX = async (buffer: AudioBuffer, stopOffset = 2) => {
        const bufferSource = ctx.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(soundsGain);
        bufferSource.start(0);
        bufferSource.stop(ctx.currentTime + stopOffset);
    }

    const playSound = (sound: sound, stopOffset = 2) => {
        if (!soundBuffers.current[sound]) return;
        return _playbackFX(soundBuffers.current[sound]!, stopOffset);
    }

    const _playbackAnnounce = (buffer: AudioBuffer, stopOffset = 2) => {
        const bufferSource = ctx.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(announceGain);
        bufferSource.start(0);
        bufferSource.stop(ctx.currentTime + stopOffset);
    }

    const playAnnounce = (sound: sound, stopOffset = 3) => {
        if (!soundBuffers.current[sound]) return;
        return _playbackAnnounce(soundBuffers.current[sound]!, stopOffset);
    }

    // Only for settings
    const playMasterSound = () => {
        const bufferSource = ctx.createBufferSource();
        bufferSource.buffer = soundBuffers.current.take!;
        bufferSource.connect(masterGain);
        bufferSource.start(0);
        bufferSource.stop(ctx.currentTime + 2);
    }

    const changeGain = (id: 'FX' | 'announce' | 'master', value: number) => {

        switch (id) {
            case 'master':
                masterGain.gain.value = value;
                playMasterSound();
                window.localStorage.setItem("masterGain", value.toString())
                break;
            case 'FX':
                soundsGain.gain.value = value;
                playSound('take');
                window.localStorage.setItem("FXGain", value.toString())
                break;
            case 'announce':
                announceGain.gain.value = value;
                playAnnounce('firstblood');
                window.localStorage.setItem("announceGain", value.toString());
                break;
            default:
                return;
        }
    }




    return (

        <AudioCtx.Provider value={{ playSound, changeGain, playAnnounce, fetchMainSounds, fetchUltimateSounds, fetchSound }}>
            {children}
        </AudioCtx.Provider>

    )



}

export default AudioProvider;