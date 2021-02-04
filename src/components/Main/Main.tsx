import React, {useState, useEffect} from 'react';
import { apiGetCanvasOnTheWals } from '../../componentsThreeJs/api.metods';
import {userMode, choosed_room} from "../../unitedStates/configState";
import Gallery from '../Gallery/Gallery';
import {singleTonGetPaintsData} from "../../unitedStates/configState"
const Main: any = (props: any) => {
    
    const [paintsFromLinks, setPaintsFromLinks] = useState(null)
    
    useEffect(() => {
        apiGetCanvasOnTheWals()
            .then(result =>{
                console.log("result", result);
                
                singleTonGetPaintsData.data =  result
                setPaintsFromLinks(result)
                return {data:result}
            })
            .catch(error => console.error('index getPaints ' + error));
    }, []);

    return (
        <>
        {paintsFromLinks && <Gallery
               roomId={choosed_room}
               paintsOnWall={paintsFromLinks} 
               roomSkin={"skin1"}
               userMode={userMode}
            /> 
        }
        </>
    );
};


export default Main;
