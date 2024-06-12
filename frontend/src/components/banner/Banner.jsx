import React from 'react';

import './banner.css';
import banner_background from '../../assets/drone_on_black_background.jpg'

const Banner = () => {
  return (
    <div className='vantage__banner section__padding'>
      <div className="vantage__banner-image">
        <img src={banner_background} alt="Banner Background" />
      </div>
      <div className="vantage__banner-content">
        <p>
        " Photography allows us to capture moments from unique perspectives, but with drones, 
        we soar beyond limitations, unlocking a world of infinite possibilities, 
        where the sky becomes our canvas and the camera, our brush "
        </p>
      </div>
    </div>
  )
}

export default Banner
