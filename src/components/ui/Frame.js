import React from 'react';
import "styles/ui/Frame.scss";
// import WoodyBackground from './WoodyBackground';

const Frame = props => {
  return (
    <div className='Frame Outer'>
            <div className='Frame Ring'>
                <div className='Frame Inner'>
                    {props.children}
                </div>
            </div>
        {/* // </WoodyBackground> */}
    </div>
  );
}
export default Frame;