import { 
    HemisphereLight, HemisphereLightHelper, 
    SpotLight, SpotLightHelper, AmbientLight, DirectionalLight, DirectionalLightHelper,

} from "three";
import {vector3data} from '../utils/interfaces';

// ambientLight
const ambientLight = new AmbientLight( 0xffffff, 0.3 ) 
ambientLight.name = 'ambientLight'

// HemisphereLight
const skyColor = "#fefec4";  // light blue
const groundColor = '#4f698d';  // brownish orange
const intensity = 0.5;
const hemisphereLight = new HemisphereLight(skyColor, groundColor, intensity);
hemisphereLight.position.set(-550,430,50)
hemisphereLight.name = 'hemisphereLight'

const hemisphereLightHelper = new HemisphereLightHelper( hemisphereLight, 5 );
hemisphereLightHelper.name = 'hemisphereLightHelper'

/* 
SpotLight( color : Integer, 
    intensity : Float, 
    distance : Float, 
    angle : Radians, 
    penumbra : Float, 
    decay : Float )
    */
const spotLight = new SpotLight( 0xffffff, 0.2, 100000, Math.PI/5,0,0 );
spotLight.castShadow = true
spotLight.name=`spotLight`
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

const spotLightHelper = new SpotLightHelper( spotLight );
function updateSpotLight() {
    spotLight.target.updateMatrixWorld();
    spotLightHelper.update();
    spotLightHelper.name='spotLightHelper'
}


// directionalLight
const dirLight = new DirectionalLight( 0xffffff, 0 );
dirLight.name = 'dirLight'

dirLight.castShadow = true;
    
const dLhelper = new DirectionalLightHelper( dirLight, 50);
dLhelper.name = 'dirLightHelper'

function updateDirLight() {
    dirLight.target.updateMatrixWorld();
    dLhelper.update();
}


export const addLights=(
    scene: any,
    isLightsOn:boolean,
    isLightHelpers: boolean,
    spotLightPosition: vector3data, 
    spotLightTargetPosition: vector3data,
    dirLightPosition: vector3data,
    dirLightTargetPosition: vector3data
    )=>{
            ambientLight.intensity = 0.7;
            scene.add(ambientLight);
            scene.add(hemisphereLight);
        
        if (isLightsOn){
            spotLight.position.set(
                spotLightPosition.x,
                spotLightPosition.y,
                spotLightPosition.z,
            );
            spotLight.target.position.set(
                spotLightTargetPosition.x,
                spotLightTargetPosition.y,
                spotLightTargetPosition.z,
            );
            updateSpotLight();
            scene.add( spotLight );
    
            dirLight.position.set(
                dirLightPosition.x,
                dirLightPosition.y,
                dirLightPosition.z,
            );
            dirLight.target.position.set(
                dirLightTargetPosition.x,
                dirLightTargetPosition.y,
                dirLightTargetPosition.z,
            )
            updateDirLight();
            scene.add( dirLight );
            
            if(isLightHelpers){
                scene.add( hemisphereLightHelper );
                scene.add( spotLightHelper );
                scene.add( dLhelper );
            }
        }
        
    }