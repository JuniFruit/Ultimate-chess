import { FC, PropsWithChildren, useCallback, useState } from "react";
import { IoArrowBackCircle, IoArrowForwardCircle } from "react-icons/io5";
import { Button } from "../button/Button";
import { IBook } from "./Book.interface";
import styles from './Book.module.scss';


export const Book: FC<PropsWithChildren<IBook>> = ({ pages, children }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const dummyPages = new Array(5).fill(<div className={styles.dummy_page}></div>)

    const handleChangePage = useCallback((nav: 'prev' | 'next') => {
        setCurrentPage(prev => nav === 'next' ? prev+=1 : prev-=1);
        
    }, [currentPage])
    
    return (
        <div className={styles.book_container}>

            <div className={styles.book_wrapper}>
                <div className={styles.cover}></div>
                <div className={styles.page_container}>
                    {dummyPages.map(item => item)}
                    <>
                        {pages.length && pages[currentPage] ? pages[currentPage] : null}
                    </>
                    <div className={styles.book_nav}>
                        <Button
                            onClick={() => handleChangePage('prev')}
                            disabled={currentPage <= 0}
                            title={'Previous page'}
                        >
                            <IoArrowBackCircle />
                        </Button>
                        {children}
                        <Button
                            onClick={() => handleChangePage('next')}
                            disabled={currentPage >= pages.length - 1}
                            title={'Next page'}
                            >
                            <IoArrowForwardCircle />
                        </Button>
                    </div>

                </div>
                <div className={styles.back_cover}></div>

            </div>

        </div>
    )

}