import React from 'react';

import { motion } from 'framer-motion';

import './portfolio.css';

import dji from '../../assets/dji.jpg';
import kolida from '../../assets/kolida.jpg'
import baofeng from '../../assets/baofeng.jpg'

const Portfolio = () => {
  return (
    <div>
      <div className='vantage__portfolio'>
            <div className="vantage__portfolio-heading section__padding gradient__bg">  
              <h1>PORTFOLIO</h1>
              <p>UNLOCKING BOUNDLESS CREATIVITY</p>
            </div>
            <motion.div className='vantage__portfolio-partners section__padding gradient__bg'>
                <div className='vantage__portfolio-partner'>
                      <img src={dji} alt="dji"/>
                </div>
                <div className='vantage__portfolio-partner'>
                      <img src={baofeng} alt="baofeng"/>
                </div>
                <div className='vantage__portfolio-partner'>
                      <img src={kolida} alt="kolida"/>
                </div>
              </motion.div>
        </div>
    </div>
  )
}

export default Portfolio
