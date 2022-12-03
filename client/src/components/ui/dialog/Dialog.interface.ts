
export interface IDialog {
    message: string;
    onDialog: () => void;
    isOpen:boolean;
    onClose: () => void;
}