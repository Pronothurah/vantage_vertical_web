import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import drone from '../../assets/aerial_drone.jpg'
import kcaa from '../../assets/kcaa.png'


import './header.css'

const Header = () => {
    const navigate = useNavigate();

    const handleFormValidationClick = () => {
        navigate('/form-validation');
    };

    return(
        <>
        <div className='vantage__header section__padding gradient__bg' id='home'>
            <motion.div 
                className='vantage__header-content'
                initial={{ x: '-100vw'}}
                animate={{x: 0}}
                transition={{delay: 1.5, type: 'spring', stiffness: 120}}
            >
                <h1 >Experience the thrill of flight with cutting-edge drone technology</h1>
                <div 
                className='vantage__header-content_input'
                >
                    {/* <input type="email" placeholder='Enter Your Email'/> */}
                    <button 
                    type='button' 
                    onClick={handleFormValidationClick}
                    >
                        Get Started
                    </button>
                </div>
            </motion.div>
            
            <div className='vantage__header-image'>
                    <motion.img 
                    src={drone} 
                    alt="drone on air"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    // transition={{delay: 0.5}}
                    />
            </div>
        </div>
        <div className='vantage__header-info section__padding'>
            <div className='vantage__header-info_left'>
                <h1>Kenya&apos;s preferred drone services provider.</h1>
            </div>
            <div className='vantage__header-info_right'>
                <p>
                    Vantage Vertical is dedicated to unlocking new horizons 
                    and empowering your visions to take flight. With cutting-edge technology and a commitment 
                    to excellence, we soar above the rest, offering a seamless blend of creativity and expertise.
                </p>
                <p>
                    Vantage Vertical is licensed and registered with the Kenya 
                    Civil Aviation Authority (KCAA) to conduct Aerial operations in Kenya
                </p>
                <div className='vantage__header-info-img'>
                    <img src={kcaa} alt="kcaa" />
                </div>
            </div>
        </div>
        
        </>
    );
};


export default Header;