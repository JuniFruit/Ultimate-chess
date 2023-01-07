


export interface IRangeInput {
    min: number;
    step: number;
    max: number;
    id: string;
    defaultValue: number;
    onRangeChange: (inputTarget: HTMLInputElement) => void;
    label: string;
}