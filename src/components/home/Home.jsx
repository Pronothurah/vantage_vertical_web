import React from 'react';
import { Header } from '../../containers';
import { Brand } from '..';
import Banner from '../banner/Banner';

function Home() {
  return (
    <div id='home'>
        <Header />
        <Brand />
        <Banner />
    </div>
  )
}

export default Home;