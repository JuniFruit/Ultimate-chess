import { IMatchInfo } from "./main/MatchInfo.interface";

export interface IMatchInfoContainer extends Omit<IMatchInfo, "setActiveWindow" | "activeWindow" | "chatProps" | "setIsNewMsg" | "isNewMsg"> {
    isMobileOpen: boolean;
    onCloseMobile: () => void;
    onNewNotification: (value: boolean) => void;
}