import { FC, useCallback, useState, memo } from 'react';
import { useIsMobile } from '../../../../hooks/useMobile';
import { useChat } from './chat/useChat';
import { IMatchInfoContainer } from './Container.interface';
import { activeWindow } from './main/MatchInfo.interface';
import MatchInfo from './main/MatchInfo';
import MatchInfoMobile from './match-info-mobile/MatchInfoMobile';


const MatchInfoContainer: FC<IMatchInfoContainer> = memo(({ onCloseMobile, isMobileOpen, ...rest }) => {

    const [activeWindow, setActiveWindow] = useState<activeWindow>('game');

    const [isNewMsg, setIsNewMsg] = useState(false);

    const handleNewMsg = useCallback(() => {
        if (activeWindow === 'chat') return;
        setIsNewMsg(true);
    }, [activeWindow])

    const handleSetIsNewMsg = useCallback((value: boolean) => {
        setIsNewMsg(value);
    }, [])

    const handleSetActiveWindow = useCallback((window: activeWindow) => {
        setActiveWindow(window);
    }, [])

    const { isMobile } = useIsMobile();
    const { messages, handleSendMessage } = useChat({ onNewMsg: handleNewMsg })
    return (
        <>
            {!isMobile ?
                <MatchInfo {...{
                    ...rest, isNewMsg, setIsNewMsg: handleSetIsNewMsg,
                    chatProps: { messages, onSend: handleSendMessage }, activeWindow, setActiveWindow: handleSetActiveWindow
                }} />
                : null
            }
            {isMobile && isMobileOpen
                ? <MatchInfoMobile
                    onClose={onCloseMobile}
                    {...{
                        ...rest, isNewMsg, setIsNewMsg: handleSetIsNewMsg,
                        chatProps: { messages, onSend: handleSendMessage }, activeWindow, setActiveWindow: handleSetActiveWindow
                    }}
                /> : null
            }

        </>
    )
})


export default MatchInfoContainer;