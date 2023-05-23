import React from 'react';
import { useState } from 'react';

import droneFrameImage from '../../assets/drone_frame.jpg';
import droneOnTeaFarmImage from '../../assets/drone_on_teafarm.jpg';
import droneOnRiverImage from '../../assets/drone_on_river.jpg';

import './technology.css'


const Technology = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLearnMoreVisible, setLearnMoreVisible] = useState(false);

    const images = [
        droneFrameImage,
        droneOnTeaFarmImage,
        droneOnRiverImage
    ];

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex  + 1));
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };


    const toggleLearnMore = () => {
        setLearnMoreVisible((prevVisible) => !prevVisible);
    };

  return (
    <div className='vantage__technology'>
      <div className="vantage__technology-landing">
        <div className="arrows">
            <button className='arrow left' onClick={prevImage}>
            &lt;
            </button>
            <button className='arrow right' onClick={nextImage}>
            &gt;
            </button>
        </div>

        <div className="content__container">
            {images.map((image, index) => (
                <div
                key={index}
                className={`content__section ${index === currentImageIndex ? 'active' : ''}`}
                style={{
                    backgroundImage: `url(${image})`
                }}  
                >
                    <div className="content">
                        <h1>COMMERCIAL DRONE SOLUTIONS</h1>
                        <button onClick={toggleLearnMore}>{isLearnMoreVisible ? 'Hide Details' : 'Learn More'}</button>
                        
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className=" ">
            {isLearnMoreVisible && (
                <div className="vantage__technology-details section__padding">
                    <ul>
                    <li>Aerial Photography and Videography</li>
                    <li>Surveying and Mapping</li>
                    <li>Agriculture and Crop Monitoring</li>
                    <li>Infrastructure Inspection</li>
                    <li>Search and Rescue</li>
                    <li>Environmental Monitoring</li>
                    <li>Disaster Response</li>
                    <li>Inspections and Maintenance</li>
                    <li>Security and Surveillance</li>
                    <li>Recreational and Hobbyist Use</li>
                    </ul>
                </div>
            )}
      </div>
    </div>
  )
}

export default Technology
