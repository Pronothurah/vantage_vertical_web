import React from 'react';


// import droneFrameImage from '../../assets/drone_frame.jpg';
// import droneOnTeaFarmImage from '../../assets/drone_on_teafarm.jpg';
// import droneOnRiverImage from '../../assets/drone_on_river.jpg';

import './technology.css'
import Banner from '../banner/Banner';


const Technology = () => {
    
  return (
    <div className='vantage__technology'>
      <div className="vantage__technology-heading section__padding gradient__bg">  
            <h1>COMMERCIAL DRONE SOLUTIONS</h1>
            <p>UNLEASH THE POWER OF PRECISION</p>        
        </div>

        <div className="vantage__technology-details section__padding">
            <ul>
            <li> Introduction: Begin with a captivating headline that highlights the key benefits of your drone technology. Provide a 
                brief introduction to set the context and generate interest</li>
            <li>High-level overview: Include a section that gives a summary of
                 your drone's capabilities, such as flight time, range, payload capacity, 
                 and any unique features that set it apart from competitors</li>
            <li>Visuals: Incorporate high-quality images or videos of your drone in action. Showcasing your
                 product's design, flight performance, and use cases can be highly engaging and build trust 
                 with potential customers.</li>
            <li>Key features: List and describe the most important features of your drone technology. 
                Highlight aspects like stability, maneuverability, autonomous flight modes, camera quality,
                 obstacle avoidance, and any other standout functionalities.</li>
            <li>Use cases: Demonstrate the various applications of your drone technology. Include sections or examples that 
                showcase how your drone can be used in industries such as photography, videography, surveying, mapping, 
                agriculture, delivery, or search and rescue. Use compelling visuals and storytelling to illustrate the benefits.</li>
            <li>Specifications: Provide a detailed breakdown of technical specifications, including 
                information about the drone's dimensions, weight, battery type, camera specifications
                , sensors, connectivity options, and compatibility with accessories or software</li>
            <li>Social proof: Showcase any awards, certifications, or partnerships your company has received, 
                along with logos or badges that indicate industry recognition or trust.</li>
            <li>Pricing and purchasing information: Include pricing details, different package options (if applicable), 
                and information on how customers can purchase your drone. Consider linking to an e-commerce platform or 
                providing contact information for sales inquiries.</li>
            <li>Testimonials and reviews: Incorporate testimonials or reviews from satisfied customers or industry experts. 
                Positive feedback can help build credibility and trust in your product.</li>
            </ul>
        </div>
        <Banner />
    </div>
  )
}

export default Technology;


// const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // const [isLearnMoreVisible, setLearnMoreVisible] = useState(false);

    // const images = [
    //     droneFrameImage,
    //     droneOnTeaFarmImage,
    //     droneOnRiverImage
    // ];

    // const nextImage = () => {
    //     setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex  + 1));
    // };

    // const prevImage = () => {
    //     setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    // };


    // const toggleLearnMore = () => {
    //     setLearnMoreVisible((prevVisible) => !prevVisible);
    // };


// {/* <div className='vantage__technology'>
//       <div className="vantage__technology-landing">
//         {/* <div className="arrows">
//             <button className='arrow left' onClick={prevImage}>
//             &lt;
//             </button>
//             <button className='arrow right' onClick={nextImage}>
//             &gt;
//             </button>
//         </div> */}

//         <div className="content__container">
//             {images.map((image, index) => (
//                 <div
//                 key={index}
//                 className={`content__section ${index === currentImageIndex ? 'active' : ''}`}
//                 style={{
//                     backgroundImage: `url(${image})`
//                 }}  
//                 >
//                     <div className="content">
//                         <h1>COMMERCIAL DRONE SOLUTIONS</h1>
//                         {/* <button onClick={toggleLearnMore}>{isLearnMoreVisible ? 'Hide Details' : 'Learn More'}</button> */}
                        
//                     </div>
//                 </div>
//             ))}
//         </div>
//       </div> */}


