import React from 'react';
import { useNavigate } from 'react-router-dom';

import './about.css';
import Banner from '../banner/Banner';

import { FaCamera } from 'react-icons/fa';
import { GiDeliveryDrone } from 'react-icons/gi';
import { TbDrone } from 'react-icons/tb';
import { SiDrone } from 'react-icons/si';
import { GiWindTurbine } from 'react-icons/gi';

import avatar from '../../assets/profile.png'

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

      {/* Team Section */}

      <div className="vantage__about-team section__padding">

        {/* Header */}
        <div className="vantage__about-team_header">
        <h1>MEET THE TEAM</h1>
        <p>LEADERSHIP TEAM</p>
        </div>

        {/* The team */}

        <div className="vantage__about-team_members">
          <div className="vantage__about-team_member">
              <div className="vantage__about-team_avatar">
                <img src={avatar} alt="Avatar" />
              </div>
              <div className="vantage__about-team_description">
                <h4>Michael</h4>
                <h6>Managing Director / Founder</h6>
                <p>
                Michael founded Vantage Vertical in 2022 as a way of combining his love of technology 
                with a passion for drones and aircrafts. With over 2 years of experience Michael brings 
                a wealth of knowledge to each project and is always at the forefront of emerging trends and tech. 
                </p>
              </div>
              
          </div>
          <div className="vantage__about-team_member">
              <div className="vantage__about-team_avatar">
                <img src={avatar} alt="Avatar" />
              </div>
              <div className="vantage__about-team_description">
                <h4>Ian</h4>
                <h6>Director</h6>
                <p>
                  Ian is the head of creative service video and content production. He has worked with 
                  international brands and 
                  knows how to bring the wow-factor to any project.
                </p>
              </div>
              
          </div>
        </div>
      </div>

      <Banner />

      <div className="vantage__about-story section__padding">
        <div className="vantage__about-story_heading">
          <h1>Our Story.</h1>
        </div>
        <div className="vantage__about-story_description">
          <p>Vantage Vertical took flight in 2022 with a passionate vision to redefine Drones and Umnanned aircrafts 
            and revolutionize the way we capture the world from above. Born out of a shared love for drones 
            and the endless possibilities they offer, our company was founded with the goal of delivering 
            breathtaking visuals and unlocking new perspectives. With cutting-edge technology, a team of skilled pilots,
             and a commitment to innovation, Vantage Vertical quickly established itself as a leading force in the drone industry.</p>
          <p>
          We are committed to safety, professionalism, and client satisfaction. We prioritize adherence to all regulatory 
          requirements and maintain a meticulous approach to ensure flawless operations on every project. Our team is dedicated 
          to delivering exceptional results, exceeding expectations, and forging long-lasting partnerships. We are proud to have 
          served a diverse clientele, spanning industries and individuals alike, and we look forward to continuing to push boundaries, 
          capturing breathtaking moments, and telling stories from new heights.
          </p>
          <p>
          Join us as we embark on a journey to elevate perspectives and capture the world from a vantage point
           that leaves an indelible impression.
          </p>
        </div>
      </div>
    </>
  )
}

export default About
