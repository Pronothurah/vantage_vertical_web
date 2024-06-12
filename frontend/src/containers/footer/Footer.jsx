import React from 'react';
import { useNavigate } from 'react-router-dom';

import vantageLogo from '../../assets/vantage_logo_whitebg.jpg';
import { BsTwitter } from "react-icons/bs";
import { IoLogoInstagram } from "react-icons/io";
import { RiChat1Line } from "react-icons/ri";
import { FaFacebookF } from "react-icons/fa";

import './footer.css'

const Footer = () => {
    const navigate = useNavigate();

    const handleFormValidationClick = () => {
      navigate('/form-validation');
    };

    return(
        <div className='vantage__footer section__padding'>
            <div className='vantage__footer-heading'>
                <h1>
                Do you want to step in to the future before others?
                </h1>
            </div>
            <div className='vantage__footer-btn' onClick={handleFormValidationClick}>
                <p>Request Our Services</p>
            </div>

            <div className='vantage__footer-links'>
                <div className='vantage__footer-links__logo'>
                    <img src={vantageLogo} alt="" />
                    <div className='vantage__footer-icons'>
                        <BsTwitter />
                        <IoLogoInstagram />
                        <RiChat1Line/>
                        <FaFacebookF />
                    </div>
                </div>
                <div className="vantage__footer-links__div">
                    <h4>Company</h4>
                    <p>About</p>
                    <p>Terms & conditions</p>
                    <p>Privacy Policy</p>
                    <p>Contact</p>
                </div>
                <div className="vantage__footer-links__div">
                    <h4>Get in touch</h4>
                    <p>Garden Estate, Nairobi, Kenya. All rights reserved.</p>
                    <p>+254 717 239 408</p>
                    <p>info@vantagevertical.com</p>
                </div>
                
            </div>

            <div className="vantage__footer-copyright">
                <p>@Vantage Vertical, 2023. All rights reserved.</p>
            </div>
            
        </div>
    );
};


export default Footer;
