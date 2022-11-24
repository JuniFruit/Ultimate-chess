import { IPack } from "../../../../types/pack.interface";



export interface IPackMenu {
    packs: IPack[], 
    setPreview: (src:string) => void 
}