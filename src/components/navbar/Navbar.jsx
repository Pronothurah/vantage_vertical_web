import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../../assets/vantage_logo_checkedbg.png'

import './navbar.css'
import { useState, useEffect } from 'react';

const Menu = () => (
    <>
        <p><Link to="/">Home</Link></p>
        <p><Link to="/about">About</Link></p>
        <p><Link to="/portfolio">Portfolio</Link></p>
        <p><Link to="/technology">Technology</Link></p>
        <p><Link to="/training">Training</Link></p>
        <p><Link to="/blog">Blog</Link></p>
    </>
)


const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);

    const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

    return(
       <BrowserRouter>
        <div className={`vantage__navbar ${isScrolled ? 'fixed-nav' : ''}`}>
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
        </BrowserRouter> 
    );
};


export default Navbar;
