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
        </Route>
      </Routes>
    </>
  )
}

export default App;
