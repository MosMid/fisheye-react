import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Photographer from './pages/Photographer';
import Profil from './pages/Profil';
import Redirect from './pages/Redirect';

//const serverUrl: string = 'http://localhost:3000/api/';
//const serverUrl: string = 'https://mighty-caverns-57917.herokuapp.com/api/';
const serverUrl: string = 'https://fisheye-56cce17ea715.herokuapp.com/api/';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home url={serverUrl}/>}/>
        <Route path='/signin' element={<Signin url={serverUrl}/>}/>
        <Route path='/signup' element={<Signup url={serverUrl}/>}/>
        <Route path='/Photographer' element={<Photographer url={serverUrl}/>}/>
        <Route path='/profil' element={<Profil url={serverUrl}/>}/>
        <Route path='/redirect' element={<Redirect/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
