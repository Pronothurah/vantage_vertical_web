import React from 'react';
import { Routes, Route } from 'react-router-dom';

import {Navbar, About, Home} from './components';
import {Footer} from './containers';

import './App.css';

function App() {
  return (
    <div className="App">
      <div className='gradient__bg'>
        <Navbar />
      </div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="about" element={<About />} />
        </Routes>
      <Footer />
    </div>
  );
}

export default App;
