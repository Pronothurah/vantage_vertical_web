import React from 'react';
import { Routes, Route } from 'react-router-dom';

import {Navbar, About, Home, Technology, FormValidation, Training, Portfolio} from './components';
import {Footer, Blog} from './containers';

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
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="technology" element={<Technology />} />
          <Route path="training" element={<Training />} />
          <Route path="blog" element={<Blog />} />
          <Route path="form-validation" element={<FormValidation />} />      
        </Routes>
      <Footer />
    </div>
  );
}

export default App;
