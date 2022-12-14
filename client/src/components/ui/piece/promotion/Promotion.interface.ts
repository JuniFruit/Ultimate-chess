import { FigureTypes } from "../../../../model/figures/figures.interface";


export interface IPromotionWindow {
    handlePromotion: (figureType: FigureTypes) => void;
    
}