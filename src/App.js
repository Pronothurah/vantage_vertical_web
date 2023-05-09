import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';

import {Brand, Navbar, About} from './components';
import {Footer, Blog, Header} from './containers';

import './App.css';

function App() {
  return (
    <div className="App">
      <div className='gradient__bg'>
        <Navbar />
        <Header />
      </div>
      <Brand />
      <BrowserRouter>
      <Routes>
        
        <Route exact path="/about" component={<About />} />
        {/* <Blog /> */}
      </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
