import { SkillNames } from "../model/ultimate/Skills";

export type AudioContextType = {
  playbackFX: (buffer: AudioBuffer, stopOffset?: number) => void;
  playSound: (sound: sound, stopOffset?: number) => void;
  changeFXGain: (value: number) => void;
  changeMasterGain: (value: number) => void;
  playMasterSound: () => void;
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
  bookOpen?: AudioBuffer,
  turnPage?: AudioBuffer,
  newMsg?: AudioBuffer,
  invalid?: AudioBuffer,
  drawRequest?: AudioBuffer,
  [SkillNames.INCINERATE]?: AudioBuffer;
  [SkillNames.LIGHTNING_BOLT]?: AudioBuffer;
  [SkillNames.PLAGUE]?: AudioBuffer;
  [SkillNames.SACRIFICE]?: AudioBuffer;
}

export type sound = 'check' | 'take' | 'move' | 'castle' | 'promotion'
  | 'promotionVoice' | 'unstoppable' | 'gameOver' | 'spree' | 'dominating' | 'firstblood' | SkillNames
  | 'invalid' | 'drawRequest' | 'turnPage' | 'newMsg' | 'bookOpen' | 'invalid';