import { FC, lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ErrorFallback } from '../components/ui/error/ErrorFallback';
import { Spinner } from '../components/ui/loading/Spinner';

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

    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes>
        <Route path='/' element={
          <Suspense fallback={<Spinner />}>
            <Layout />
          </Suspense>
        }>

          <Route path='/' element={<Home />} />
          <Route path='/play' element={<PlayChess />} />
          <Route path='/play-ultimate' element={<PlayChess isUltimate={true} />} />
          <Route path='/game-room/:id' element={<GameRoom />} />
          <Route path='/packs' element={<Packs />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/registration' element={<RegisterPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/watch' element={<WatchPage />} />
          <Route path='/user/:id' element={<ProfilePage />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>

      </Routes>

    </ErrorBoundary>

  )
}

export default App;
