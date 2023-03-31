import React from 'react'
import "styles/ui/WoodyBackground.scss"

const WoodyBackground = () => {
  return (
    // <div class="svg">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" 
           xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" 
           id="wood" x="0px" y="0px" viewBox="0 0 512 512" 
           height="100%" width="100%" preserveAspectRatio="xMidYMid slice">
        <filter id="roughen" x="0" y="0" width="100%" height="100%">
          <feTurbulence result="noise1" type="turbulence" seed="5" 
                        baseFrequency="0.03 0.01" numOctaves="3" 
                        stitchTiles="stitch" />
          <feTurbulence result="noise2" type="fractalNoise" seed="4" 
                        baseFrequency="0.3 0.05" numOctaves="3" 
                        stitchTiles="stitch" />
          <feTurbulence result="noise3" type="turbulence" seed="3"
                        baseFrequency="0.02 0.005" numOctaves="3" 
                        stitchTiles="stitch" />
          <feDiffuseLighting in="noise1" result="lighting1" 
                             surfaceScale="-10" diffuseConstant="0.7">
            <feDistantLight azimuth="225" elevation="45" />
          </feDiffuseLighting>
          <feDiffuseLighting in="noise2" result="lighting2" 
                             surfaceScale="-5" diffuseConstant="0.3">
            <feDistantLight azimuth="225" elevation="75" />
          </feDiffuseLighting>
          <feDiffuseLighting in="noise3" result="lighting3" 
                             surfaceScale="20" diffuseConstant="0.55">
            <feDistantLight azimuth="225" elevation="90" />
          </feDiffuseLighting>
          {/* <!-- Blend --> */}
          <feBlend in="lighting1" in2="lighting2" result="combined1" 
                   mode="overlay" />
          <feBlend in="combined1" in2="lighting3" result="combined2" 
                   mode="overlay" />
          <feBlend in="SourceGraphic" in2="combined2" 
                   mode="overlay" />
        </filter>
        {/* <!-- Rectangle --> */}
        <rect x="0" y="0" width="100%" height="100%" filter="url(#roughen)" fill="#808080" />
      </svg>
    // </div>
  )
}

export default WoodyBackground;