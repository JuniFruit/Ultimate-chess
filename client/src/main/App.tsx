import { FC, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Spinner } from '../components/ui/loading/Spinner';
import PlayChess from '../components/pages/play/PlayChess';
import ProfilePage from '../components/pages/profile/ProfilePage';
import RegisterPage from '../components/pages/auth/register/Register';
import Login from '../components/pages/auth/login/Login';

const AdminPage = lazy(() => import('../components/pages/admin/Admin'));
const GameRoom = lazy(() => import('../components/pages/game-room/GameRoom'));
const Home = lazy(() => import('../components/pages/home/Home'));
const Packs = lazy(() => import('../components/pages/packs/Packs'));
const WatchPage = lazy(() => import('../components/pages/watch/WatchPage'));

const App: FC = () => {

  return (
    <>
      <Suspense fallback={
        <Layout title='Ultimate Chess'>
          <Spinner />
        </Layout>

      }>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/play' element={<PlayChess />} />
          <Route path='/play-ultimate' element={<PlayChess isUltimate={true} />} />
          <Route path='/game-room/:id' element={<GameRoom />} />
          <Route path='/registration' element={<RegisterPage />} />
          <Route path='/packs' element={<Packs />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/watch' element={<WatchPage />} />
          <Route path='/user/:id' element={<ProfilePage />} />
        </Routes>

      </Suspense>
    </>
  )
}

export default App;
