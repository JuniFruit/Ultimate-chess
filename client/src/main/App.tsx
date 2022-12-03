import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import GameRoom from '../components/pages/game-room/GameRoom';
import Home from '../components/pages/home/Home';
import Packs from '../components/pages/packs/Packs';
import PlayChess from '../components/pages/play/PlayChess';
import RegisterPage from '../components/pages/register/Register';

const App: FC = () => {



  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/play' element={<PlayChess />} />
        <Route path='/game-room/:id' element={<GameRoom />} />
        <Route path='/registration' element={<RegisterPage />} />
        <Route path='/packs' element={<Packs />} />
      </Routes>
    </>
  )
}

export default App;
