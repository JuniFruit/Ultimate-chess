

export const getHandshakeAuth = () => {
    return {
        token: tokenDecoder(),
        guestName: tokenDecoder() ? null : getGuestName()
    }
}


const tokenDecoder = () => {

    if (!window.localStorage['persist:root']) return '';
    const root = JSON.parse(window.localStorage['persist:root']).auth;

    return JSON.parse(root).user?.accessToken
}

const getGuestName = () => {
    let guestUsername = window.sessionStorage.getItem('guestUsername');

    if (!guestUsername) {
        guestUsername = `Guest_${Math.floor(Math.random() * 10000)}`;
        window.sessionStorage.setItem('guestUsername', guestUsername);
    }

    return guestUsername
}