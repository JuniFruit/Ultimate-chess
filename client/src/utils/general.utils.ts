
export const setTabTitle = (title: string) => {
    document.title = title;
}


export const randomize = (max = 100) => {
    return Math.floor(Math.random() * max)
}