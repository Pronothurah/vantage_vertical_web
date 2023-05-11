import React from 'react';
import { useNavigate } from 'react-router-dom';

import './about.css';

import { FaCamera } from 'react-icons/fa';
import { GiDeliveryDrone } from 'react-icons/gi';
import { TbDrone } from 'react-icons/tb';
import { SiDrone } from 'react-icons/si';
import { GiWindTurbine } from 'react-icons/gi';

const About = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate('/about');



  return (
    <>
      <div className="vantage__about gradient__bg section__padding" id='about' onClick={handleClick}>
        <div className="vantage__about-heading">
          <h1>ABOUT US</h1>
          <p>WHO ARE WE?</p>
        </div>
        <div className="vantage__about-paragraph">
        <p>Vantage Vertical is a leading provider of cutting-edge drone and unmanned 
                aircraft solutions for a wide range of industries. Our mission is to deliver 
                reliable, safe, and cost-effective aerial technologies that enable our clients
                 to work smarter, faster, and more efficiently.</p>
        <p>At Vantage Vertical, we specialize in providing customized drone and unmanned aircraft 
                solutions for a variety of applications, including:</p>

                <div className="vantage__brand-items">
                <div className="vantage__brand-item">
                    <div className="vantage__brand-item_image">
                        <FaCamera className='icon' />
                    </div>
                     <p>Aerial photography and videography</p>
                </div>

                <div className="vantage__brand-item">
                    <div className="vantage__brand-item_image">
                        <GiDeliveryDrone className='icon' />
                    </div> 
                    <p>Surveying and mapping</p>
                </div>

                <div className="vantage__brand-item">
                    <div className="vantage__brand-item_image">
                        <TbDrone className='icon' />
                    </div>
                    <p>Agriculture and forestry</p>
                </div>

                <div className="vantage__brand-item">
                    <div className="vantage__brand-item_image">
                        <SiDrone className='icon' />
                    </div>
                    <p>Search and rescue operations</p>
                </div>

                <div className="vantage__brand-item">
                    <div className="vantage__brand-item_image">
                        <GiWindTurbine className='icon' />
                    </div>
                    <p>Industrial inspections and monitoring</p>
                </div>
                
            </div>


        <p>Our team of experts includes experienced pilots, engineers, and technicians who are passionate about 
          delivering the best possible solutions for our clients. With a focus on innovation and quality, 
          we are constantly pushing the boundaries of what is possible with drone and unmanned aircraft 
          technology.</p>

        <p>In addition to our cutting-edge solutions, we are committed to providing exceptional customer service and support. Whether you need help with installation, training, 
          or maintenance, our team is always here to help.</p>

        <p>At Vantage Vertical, we believe that drone and unmanned aircraft technology has the 
          potential to transform the way we work and live. We are proud to be at the forefront of 
          this exciting industry, and we look forward to working with you to help you achieve your 
          goals.</p>
        </div>
        
      </div>
    </>
  )
}

export default About
