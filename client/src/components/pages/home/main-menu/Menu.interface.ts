
export interface IMenuData {
    title: string;
    link: string;
    preview: string;
}

export interface IMenuBox<T> {
    items: T[],
    onHover: (preview: string) => void;
    onClick: (arg:any) => void;   
}

export interface IMenu<T> extends Pick<IMenuBox<T>, 'items' | 'onClick'>{}