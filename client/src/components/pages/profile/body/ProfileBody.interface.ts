import { IUser } from "../../../../types/user.interface";



export interface IProfileBody extends Pick<IUser, "packInUse" | "lossesCount" | "winsCount"> {} 