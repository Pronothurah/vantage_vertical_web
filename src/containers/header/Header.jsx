import React from 'react';
import { useNavigate } from 'react-router-dom';

import drone from '../../assets/aerial_drone.jpg'


import './header.css'

const Header = () => {
    const navigate = useNavigate();

    const handleFormValidationClick = () => {
        navigate('/form-validation');
    };

    return(
        <>
        <div className='vantage__header section__padding gradient__bg' id='home'>
            <div className='vantage__header-content'>
                <h1 >Experience the thrill of flight with cutting-edge drone technology</h1>
                <div className='vantage__header-content_input'>
                    {/* <input type="email" placeholder='Enter Your Email'/> */}
                    <button type='button' onClick={handleFormValidationClick}>Get Started</button>
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