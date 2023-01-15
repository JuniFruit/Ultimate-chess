import { lazy } from 'react';

export const setTabTitle = (title: string) => {
    document.title = title;
}


export const randomize = (max = 100) => {
    return Math.floor(Math.random() * max)
}

export const lazyLoad = (path: string, namedExport?: string) => {

    return lazy(() => {
        const promise = import(/* webpackMode: "eager" */path)
        if (!namedExport) return promise;
        return promise.then(module => ({ default: module[namedExport] }))
    })

}