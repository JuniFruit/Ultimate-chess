
export type AudioContextType = {
    playbackFX: (buffer: AudioBuffer, stopOffset?: number) => void;
    playSound: (sound: sound) => void;
  };

export interface ISoundBuffers {
    move?: AudioBuffer;
    check?: AudioBuffer;
    take?: AudioBuffer;
    castle?: AudioBuffer;
    promotion?: AudioBuffer;
    promotionVoice?: AudioBuffer;
    dominating?: AudioBuffer;
    gameOver?: AudioBuffer;
    unstoppable?: AudioBuffer;
    spree?: AudioBuffer;
    firstblood?: AudioBuffer;
}

export type sound = 'check' | 'take' | 'move' | 'castle' | 'promotion' 
| 'promotionVoice' | 'unstoppable' | 'gameOver' | 'spree' | 'dominating' | 'firstblood';