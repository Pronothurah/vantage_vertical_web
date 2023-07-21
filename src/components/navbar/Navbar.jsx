import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../../assets/vantage_logo_checkedbg.png';
import scrollToTop from '../scroll/ScrollToTop';

import './navbar.css';


const Menu = () => (
    <>
        <p><NavLink to="/" onClick={scrollToTop}>Home</NavLink></p>
        <p><NavLink to="/about" onClick={scrollToTop}>About</NavLink></p>
        <p><NavLink to="/portfolio" onClick={scrollToTop}>Portfolio</NavLink></p>
        <p><NavLink to="/technology" onClick={scrollToTop}>Technology</NavLink></p>
        <p><NavLink to="/training" onClick={scrollToTop}>Training</NavLink></p>
        <p><NavLink to="/blog" onClick={scrollToTop}>Blog</NavLink></p>
    </>
)


const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

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

    const handleFormValidationClick = () => {
        navigate('/form-validation');
      };

    const handleHomeNavigation = () => {
        navigate('/')
    };

    return(
        <div className={`vantage__navbar ${isScrolled ? 'fixed-nav' : ''}`}>
            <div className='vantage__navbar-links'>
                <div className='vantage__navbar-links_logo' onClick={handleHomeNavigation} >
                    <img src={logo} alt="logo" />
                </div>
                <div className='vantage__navbar-links__container'>
                    <Menu />
                </div>
                <div className='vantage__navbar-contact'>
                    <button type='button' className='scale-up-center' onClick={handleFormValidationClick}>Contact</button>
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
                            <button type='button' className='scale-up-center' >Contact</button>
                            </div>
                        </div>
                    )

                    }
                </div>
            </div>
        </div>
    );
};


export default Navbar;
