import React, { useEffect, useState } from 'react';
import './Loading.scss';

const Loading: React.FC = (props) => {
    const [duration, setDuration] = useState(0)
    
      useEffect(() => {
          const interval = setInterval(() => {
            if(duration<100000){
                // console.log('This will run every second!');
                setDuration(duration+1)
            }
              }, 1000);
              return () => clearInterval(interval);
      }, [duration]);
     

    return (
        <div id="Loading" className='Loading' style={{display:`${props.loading ? "block" : "none"}`}}>
            <div className="rippleWraper">
                <div className="lds-ripple">
                    <p className="caption">Loading ... </p>      
                    <div></div>
                    <div></div>
                    <p className="duration">{duration} parts</p>
                </div>
            </div>
            
        </div>
    );
};
export default Loading;
