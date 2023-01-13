import { SkillNames } from "../model/ultimate/Skills";

export type AudioContextType = {
  playSound: (sound: sound, stopOffset?: number) => void;
  playAnnounce: (sound: sound, stopOffset?: number) => void;
  changeGain: (id: 'FX' | 'announce' | 'master', value: number) => void;
  
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
  [SkillNames.DETONATE]?: AudioBuffer;
  [SkillNames.SET_BOMB]?: AudioBuffer;
  [SkillNames.BLESSING]?: AudioBuffer;
  cheer_1?: AudioBuffer;
  cheer_2?: AudioBuffer;
  cheer_3?: AudioBuffer;
  cheer_4?: AudioBuffer;
}



export type sound = 'check' | 'take' | 'move' | 'castle' | 'promotion'
  | 'promotionVoice' | 'unstoppable' | 'gameOver' | 'spree' | 'dominating' | 'firstblood' | SkillNames
  | 'invalid' | 'drawRequest' | 'turnPage' | 'newMsg' | 'bookOpen' | 'invalid' | "cheer_1" | "cheer_2" | "cheer_3" | "cheer_4";

