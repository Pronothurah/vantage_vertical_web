import React from 'react';
import vantageLogo from '../../assets/vantage_logo_whitebg.jpg'

import './footer.css'

const Footer = () => {
    return(
        <div className='vantage__footer section__padding'>
            <div className='vantage__footer-heading'>
                <h1 className='gradient__text'>
                Do you want to step in to the future before others
                </h1>
            </div>
            <div className='vantage__footer-btn'>
                <p>Request Our Services</p>
            </div>

            <div className='vantage__footer-links'>
                <div className='vantage__footer-links__logo'>
                    <img src={vantageLogo} alt="" />
                    <p>Garden Estate, Nairobi, Kenya. All rights reserved.</p>
                </div>
                <div className="vantage__footer-links__div">
                    <h4>Links</h4>
                    <p>Overons</p>
                    <p>Social Media</p>
                    <p>Contact</p>
                    <p>Overons</p>
                </div>
                <div className="vantage__footer-links__div">
                    <h4>Company</h4>
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
