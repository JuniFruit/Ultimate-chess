import { FigureTypes } from "../../../../model/figures/Figures";


export interface IPromotionWindow {
    handlePromotion: (figureType: FigureTypes) => void;
    
}