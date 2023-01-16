
import { FC, useCallback, useState } from 'react';
import { IoArrowBackCircle, IoArrowForwardCircle, IoCloseCircle } from 'react-icons/io5';
import { Button } from '../../../ui/button/Button';
import { Portal } from '../../../ui/portal/Portal';
import { ITutorialComp } from './Tutorial.interface';
import styles from './Tutorial.module.scss';
import { tutorialPages } from './tutorialData';
import { TutorialPage } from './TutorialPage';

export const TutorialComp: FC<ITutorialComp> = ({ onClose }) => {

    const [currentPage, setCurrentPage] = useState(0);

    const pages = tutorialPages.map((page) => (
        <TutorialPage
            {...{ ...page }}         
          
        />
    ));

    const handleChangePage = useCallback((nav: 'prev' | 'next') => {
        setCurrentPage(prev => nav === 'next' ? prev += 1 : prev -= 1);

    }, [currentPage])

    return (
        <Portal>
            <div className={styles.tutorial_container}>
                <div className={styles.tutorial_wrapper}>                    
                        {pages[currentPage] && pages[currentPage]}                    
                    <div className={styles.nav}>
                        <Button
                            onClick={() => handleChangePage('prev')}
                            disabled={currentPage <= 0}
                            title={'Previous page'}
                            aria-label={'previous page'}

                        >
                            <IoArrowBackCircle />
                        </Button>
                        <Button onClick={onClose} title={'Close the tutorial'}>
                            <IoCloseCircle />
                        </Button>
                        <Button
                            onClick={() => handleChangePage('next')}
                            disabled={currentPage >= pages.length - 1}
                            title={'Next page'}
                            aria-label={'next page'}

                        >
                            <IoArrowForwardCircle />
                        </Button>
                    </div>
                </div>

            </div>
        </Portal>
    )
}