import React from 'react';
import './Logo.css';
import Tilt from 'react-tilt';
import brain from './brain.png';

const Logo = () => {
    return(
        <div className='ma4 mt0'>
            {/**
             * ma4 ->  margin
             * mt0 -> margin-top
             */
            }
            {/* Adding Tilt component */}
            <Tilt className="Tilt br2 shadow-2" 
                  options={{ max : 25 }} 
                  style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa3">
                    <img style={{paddingTop: '5px'}}
                         alt='logo' 
                         src={brain}
                    />
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;