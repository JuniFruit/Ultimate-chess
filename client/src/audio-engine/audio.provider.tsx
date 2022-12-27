import { FC, createContext, PropsWithChildren, useEffect, useRef } from 'react';
import { DefaultSettings } from './audio.settings';
import { AudioContextType, ISoundBuffers, sound } from './audio.types';

const ctx = new window.AudioContext()

const masterGain = ctx.createGain();
masterGain.gain.value = DefaultSettings.master;
masterGain.connect(ctx.destination);

const soundsGain = ctx.createGain();
soundsGain.gain.value = DefaultSettings.fx;
soundsGain.connect(masterGain);

export const AudioCtx = createContext<AudioContextType | null>(null);

const AudioProvider: FC<PropsWithChildren> = ({ children }) => {

    const soundBuffers = useRef<ISoundBuffers>({});
   
    const handleFetchSounds = async () => {
        // for (let [sound, link] of Object.entries(Sounds)) {
        //     await AudioService.fetchAudio(link)
        //         .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
        //         .then(audioBuffer => (soundBuffers.current as any)[sound] = audioBuffer)
        //         .catch(e => console.log(e));
        // }
    }

    useEffect(() => {

        handleFetchSounds();

    }, [])

    const playbackFX = async (buffer: AudioBuffer, stopOffset = 2) => {
        const bufferSource = ctx.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(soundsGain);
        bufferSource.start(0);
        bufferSource.stop(ctx.currentTime + stopOffset);
    }

    const playSound = (sound: sound) => {
        if (!soundBuffers.current[sound]) return;
        return playbackFX(soundBuffers.current[sound]!);
    }

    const playSoundtrack = () => {

    }

    return (

        <AudioCtx.Provider value={{ playbackFX, playSound }}>
            {children}
        </AudioCtx.Provider>

    )



}

export default AudioProvider;