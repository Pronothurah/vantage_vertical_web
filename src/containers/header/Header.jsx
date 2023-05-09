import React from 'react';
import drone from '../../assets/aerial_drone.jpg'


import './header.css'

const Header = () => {
    return(
        <>
        <div className='vantage__header section__padding' id='home'>
            <div className='vantage__header-content'>
                <h1 className='gradient__text'>Experience the thrill of flight with cutting-edge drone technology</h1>
                <div className='vantage__header-content_input'>
                    <input type="email" placeholder='Enter Your Email'/>
                    <button type='button'>Get Started</button>
                </div>
            </div>

            <div className='vantage__header-image'>
                    <img src={drone} alt="drone on air" />
            </div>

        </div>
        </>
    );
};


export default Header;