import { FC, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { SuspenseLoading } from '../components/ui/loading/SuspenseLoading';

const Settings = lazy(() => import('../components/pages/settings/Settings'));
const AdminPage = lazy(() => import('../components/pages/admin/Admin'));
const GameRoom = lazy(() => import('../components/pages/game-room/GameRoom'));
const Home = lazy(() => import('../components/pages/home/Home'));
const PlayChess = lazy(() => import('../components/pages/play/PlayChess'))
const Login = lazy(() => import('../components/pages/auth/login/Login'));
const NotFoundPage = lazy(() => import('../components/pages/not-found/NotFoundPage'));
const Packs = lazy(() => import('../components/pages/packs/Packs'));
const RegisterPage = lazy(() => import('../components/pages/auth/register/Register'));
const ProfilePage = lazy(() => import('../components/pages/profile/ProfilePage'));
const WatchPage = lazy(() => import('../components/pages/watch/WatchPage'));




const App: FC = () => {

  return (
    <>

      <Routes>
        <Route path='/' element={
          <SuspenseLoading isSpinner={true}>
            <Home />
          </SuspenseLoading>
        } />
        <Route path='/play' element={
          <SuspenseLoading>
            <PlayChess />
          </SuspenseLoading>
        } />
        <Route path='/play-ultimate' element={
          <SuspenseLoading>
            <PlayChess isUltimate={true} />
          </SuspenseLoading>
        } />

        <Route path='/game-room/:id' element={
          <SuspenseLoading isSpinner={true}>
            <GameRoom />
          </SuspenseLoading>
        } />
        <Route path='/packs' element={
          <SuspenseLoading isSpinner={true}>
            <Packs />
          </SuspenseLoading>
        } />
        <Route path='/admin' element={
          <SuspenseLoading isSpinner={true}>
            <AdminPage />
          </SuspenseLoading>
        } />


        <Route path='/registration' element={
          <SuspenseLoading>
            <RegisterPage />
          </SuspenseLoading>
        } />
        <Route path='/login' element={
          <SuspenseLoading>
            <Login />
          </SuspenseLoading>
        } />
        <Route path='/watch' element={
          <SuspenseLoading>
            <WatchPage />
          </SuspenseLoading>
        } />
        <Route path='/user/:id' element={
          <SuspenseLoading>
            <ProfilePage />
          </SuspenseLoading>
        } />
        <Route path='/settings' element={
          <SuspenseLoading>
            <Settings />
          </SuspenseLoading>
        } />

        <Route path='*' element={
          <SuspenseLoading isSpinner={true}>
            <NotFoundPage />
          </SuspenseLoading>
        } />

      </Routes>
    </>
  )
}

export default App;
