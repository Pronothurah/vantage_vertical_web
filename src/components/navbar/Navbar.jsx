import React from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../../assets/vantage_logo_checkedbg.png'

import './navbar.css'
import { useState } from 'react';

const Menu = () => (
    <>
        <p><a href="#home">Home</a></p>
        <p><a href="#home">About</a></p>
        <p><a href="#home">Portfolio</a></p>
        <p><a href="#home">Technology</a></p>
        <p><a href="#home">Training</a></p>
        <p><a href="#home">Blog</a></p>
    </>
)


const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    return(
        <>
        <div className='vantage__navbar'>
            <div className='vantage__navbar-links'>
                <div className='vantage__navbar-links_logo'>
                    <img src={logo} alt="logo" />
                </div>
                <div className='vantage__navbar-links__container'>
                    <Menu />
                </div>
                <div className='vantage__navbar-contact'>
                    <button type='button' className='scale-up-center'>Contact Us</button>
                </div>
                <div className="vantage__navbar-menu">
                    {toggleMenu
                        ? <RiCloseLine color='#fff' size={27} onClick={ () => setToggleMenu(false)} />
                        : <RiMenu3Line color='#fff' size={27} onClick={ () => setToggleMenu(true)} />
                    }
                    {toggleMenu && (
                        <div className='vantage__navbar-menu_container scale-up-center'>
                            <div className='vantage__navbar-menu_container-links'>
                            <Menu />
                            <button type='button' className='scale-up-center'>Contact Us</button>
                            </div>
                        </div>
                    )

                    }
                </div>
            </div>
        </div>
        </>
    );
};


export default Navbar;
