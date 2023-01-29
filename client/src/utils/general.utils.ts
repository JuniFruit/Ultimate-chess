
export const setTabTitle = (title: string) => {
    document.title = title;
}


export const randomize = (max = 100) => {
    return Math.floor(Math.random() * max)
}

export const getUserAudioSettings = (value: "masterGain" | "FXGain" | "announceGain") => {

    const gain = window.localStorage[value];

    if (gain) return Number(gain);
    return null;
}