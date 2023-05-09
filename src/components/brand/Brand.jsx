import React from 'react';


import { FaCamera } from 'react-icons/fa';
import { GiDeliveryDrone } from 'react-icons/gi';
import { TbDrone } from 'react-icons/tb';
import { SiDrone } from 'react-icons/si';
import { GiWindTurbine } from 'react-icons/gi';


import './brand.css'

const Brand = () => {
    return(
        <>
        <div className="vantage__brand section__padding">
            <h2>ABOUT US</h2>
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

        </div>

        </>
    );
};


export default Brand;
