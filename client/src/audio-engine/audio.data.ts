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
    check: SoundData.chess_check,
    newMsg: SoundData.newMsg,
    invalid: SoundData.unable,
    drawRequest: SoundData.drawRequest,
    cheer_1: SoundData.cheer_1,
    cheer_2: SoundData.cheer_2,
    cheer_3: SoundData.cheer_3,
    cheer_4: SoundData.cheer_4

}

export const UltimateSounds = {
    [SkillNames.SACRIFICE]: SoundData.sacrifice,
    [SkillNames.INCINERATE]: SoundData.fire_ball,
    [SkillNames.LIGHTNING_BOLT]: SoundData.tempest,
    [SkillNames.PLAGUE]: SoundData.cast_crystal,
    [SkillNames.DETONATE]: SoundData.explosion,
    [SkillNames.SET_BOMB]: SoundData.plant_timer,
    [SkillNames.BLESSING]: SoundData.cast_spell,
    bookOpen: SoundData.bookOpen,
    turnPage: SoundData.turnPage,
}