export interface ITimer {
    initTime: number;
    isStopped: boolean;
    onTimeout: () => void;
}