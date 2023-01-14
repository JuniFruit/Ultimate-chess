import { lazy, FC, Suspense, PropsWithChildren } from 'react'
import { IBook } from './book/Book.interface';
import { IProfileForm } from './profile-form/ProfileForm.interface';
import { ITimer } from './timer/Timer.interface';
const TimerUI = lazy(() => import('./timer/Timer'));
const InfoPopUI = lazy(() => import('./info-pop/InfoPop'));
const ImagePreviewUI = lazy(() => import('./image-preview/ImagePreview'));
const BookUI = lazy(() => import('./book/Book'));
const ProfileFormUI = lazy(() => import('./profile-form/ProfileForm'));


export const InfoPop: FC = () => {
    return (
        <Suspense fallback={<div />}>
            <InfoPopUI />
        </Suspense>
    )
}

export const ImagePreview: FC<{ imageSrc?: string }> = (props) => {
    return (
        <Suspense fallback={<div />}>
            <ImagePreviewUI {...{ ...props }} />
        </Suspense>
    )
}

export const Timer: FC<ITimer> = (props) => {
    return (
        <Suspense fallback={<div />}>
            <TimerUI {...{ ...props }} />
        </Suspense>
    )
}
export const Book: FC<PropsWithChildren<IBook>> = (props) => {
    return (
        <Suspense fallback={<div />}>
            <BookUI {...{ ...props }} />
        </Suspense>
    )
}
export const ProfileForm: FC<IProfileForm> = (props) => {
    return (
        <Suspense fallback={<div />}>
            <ProfileFormUI {...{ ...props }} />
        </Suspense>
    )
}