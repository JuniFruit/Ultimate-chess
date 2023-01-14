import { FC, Suspense, PropsWithChildren } from 'react'
import { Layout } from '../../layout/Layout'
import { Spinner } from './Spinner'



export const SuspenseLoading: FC<PropsWithChildren<{ isSpinner?: boolean }>> = ({ isSpinner = false, children }) => {

    return (
        <Suspense
            fallback={
                <Layout title='Ultimate Chess'>
                    {isSpinner ? <Spinner /> : null}
                </Layout>
            }
        >
            {children}
        </Suspense>
    )
}