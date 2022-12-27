import { FC, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { Layout } from '../../layout/Layout'
import GameRoom from '../../pages/game-room/GameRoom'

export const Portal: FC<PropsWithChildren> = ({ children }) => {


    return (
        <>
            {createPortal(children, document.body)}
        </>
    )

}