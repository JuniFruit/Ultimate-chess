import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../store/api/api';
import { Layout } from '../../layout/Layout';
import Wrapper from '../../ui/wrapper/Wrapper';
import { ProfileBody } from './body/ProfileBody';
import { ProfileHeader } from './header/ProfileHeader';
import styles from './ProfilePage.module.scss';

const ProfilePage: FC = () => {

    const { id } = useParams();

    const { data: profile } = api.useGetByIdQuery(id!);

    return (
        <Layout title='Ultimate Chess Profile'>
            <section className={styles.page_wrapper}>
                <Wrapper title='Profile Card'>
                    {
                        profile
                            ?
                            <>
                                <ProfileHeader
                                    {...{ ...profile }}
                                />
                                <ProfileBody {...{...profile}} />
                            </>
                            : null
                    }

                </Wrapper>
            </section>
        </Layout>
    )
}


export default ProfilePage