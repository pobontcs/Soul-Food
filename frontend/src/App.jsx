import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Homepage';
import Dash from './dash';
import Inspection from './inspection';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App(){
  return(
        <BrowserRouter>
          <Routes>
              <Route path='/' element={<HomePage/>}/>
              <Route path='/613BRH023' element={<Dash/>}/>
              <Route path='/inspection' element={<Inspection/>}/>
          </Routes>
        
        </BrowserRouter>
  );
}


export default App;
