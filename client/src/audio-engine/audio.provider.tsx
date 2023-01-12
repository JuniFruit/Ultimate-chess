import { createContext, FC, PropsWithChildren, useEffect, useRef } from 'react';
import { Sounds } from './audio.data';
import { AudioService } from './audio.service';
import { DefaultSettings } from './audio.settings';
import { AudioContextType, ISoundBuffers, sound } from './audio.types';

const ctx = new window.AudioContext()

const masterGain = ctx.createGain();
masterGain.gain.value = Number(window.localStorage.getItem("masterGain")) || DefaultSettings.master;
masterGain.connect(ctx.destination);

const soundsGain = ctx.createGain();
soundsGain.gain.value = Number(window.localStorage.getItem("FXGain")) || DefaultSettings.fx;
soundsGain.connect(masterGain);



export const AudioCtx = createContext<AudioContextType | null>(null);

const AudioProvider: FC<PropsWithChildren> = ({ children }) => {

    const soundBuffers = useRef<ISoundBuffers>({});

    const handleFetchSounds = async () => {
        for (let [sound, link] of Object.entries(Sounds)) {
            await AudioService.fetchAudio(link)
                .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
                .then(audioBuffer => (soundBuffers.current as any)[sound] = audioBuffer)
                .catch(e => console.log(e));
        }
    }

   

    useEffect(() => {
        handleFetchSounds();    
    }, [])

    const _playbackFX = async (buffer: AudioBuffer, stopOffset = 2) => {
        const bufferSource = ctx.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(soundsGain);
        bufferSource.start(0);
        bufferSource.stop(ctx.currentTime + stopOffset);
        // soundsGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + stopOffset)
    }

    const playSound = (sound: sound, stopOffset = 2) => {
        if (!soundBuffers.current[sound]) return;
        return _playbackFX(soundBuffers.current[sound]!, stopOffset);
    }
    

    // Only for settings
    const playMasterSound = () => {
        const bufferSource = ctx.createBufferSource();
        bufferSource.buffer = soundBuffers.current.castle!;
        bufferSource.connect(masterGain);
        bufferSource.start(0);
        bufferSource.stop(ctx.currentTime + 2);
    }

    const changeMasterGain = (value: number) => {
        masterGain.gain.value = value;
    }

    const changeFXGain = (value: number) => {
        soundsGain.gain.value = value;
    }



    return (

        <AudioCtx.Provider value={{ playSound, changeFXGain, changeMasterGain, playMasterSound }}>
            {children}
        </AudioCtx.Provider>

    )



}

export default AudioProvider;