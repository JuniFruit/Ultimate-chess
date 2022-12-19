import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import GameRoom from '../components/pages/game-room/GameRoom';
import Home from '../components/pages/home/Home';
import Packs from '../components/pages/packs/Packs';
import PlayChess from '../components/pages/play/PlayChess';
import RegisterPage from '../components/pages/auth/register/Register';
import Login from '../components/pages/auth/login/Login';
import AdminHome from '../components/pages/admin/home/AdminHome';
import AdminPacks from '../components/pages/admin/packs/AdminPacks';
import AdminPlayers from '../components/pages/admin/players/AdminPlayers';
import PackEdit from '../components/pages/admin/packs/edit-pack/PackEdit';
import WatchPage from '../components/pages/watch/WatchPage';

const App: FC = () => {



  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/play' element={<PlayChess />} />
        <Route path='/game-room/:id' element={<GameRoom />} />
        <Route path='/registration' element={<RegisterPage />} />
        <Route path='/packs' element={<Packs />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin'>
          <Route path='home' element={<AdminHome />} />
          <Route path='packs' element={<AdminPacks />} />
          <Route path='players' element={<AdminPlayers />} />
          <Route path='packs/edit/:id' element={<PackEdit />} />
        </Route>
        <Route path='/watch' element={<WatchPage />} />
      </Routes>
    </>
  )
}

export default App;
