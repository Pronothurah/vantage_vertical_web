import React from 'react';

import {Brand, Navbar} from './components';
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
      <Blog />
      <Footer />
    </div>
  );
}

export default App;
