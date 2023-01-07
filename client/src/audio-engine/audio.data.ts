import { SoundData } from "../assets/Sounds/SoundAssets"
import { SkillNames } from "../model/ultimate/Skills"


export const Sounds = {
    move: SoundData.chess_move,
    castle: SoundData.castle,
    promotionVoice: SoundData.promotion_voice,
    promotion: SoundData.promotion,
    gameOver: SoundData.gameOver,
    unstoppable: SoundData.unstoppable,
    spree: SoundData.spree,
    dominating: SoundData.dominating,
    firstblood: SoundData.firstblood,
    take: SoundData.chess_take,
    [SkillNames.SACRIFICE]: SoundData.cast_hollow,
    [SkillNames.INCINERATE]: SoundData.fire_ball,
    [SkillNames.LIGHTNING_BOLT]: SoundData.tempest,
    [SkillNames.PLAGUE]: SoundData.cast_crystal

}




export const Soundtracks = {
    background_var1: '&tknv=v2',
    background_var2: '&tknv=v2',
}