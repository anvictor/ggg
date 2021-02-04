import  {MeshStandardMaterial, WebGLRenderer} from "three";
import {skinTextures} from './textures';
import {wallsGlueSetMode} from "../unitedStates/configState";
import {singleTonMtl} from "../unitedStates/configState";

export const skinMaterials = (
  skin:string, 
  room:string, 
  name:string,
  renderer: WebGLRenderer
  ) =>{
   const {
     ao_txtr, 
     light_txtr, 
     roughness_txtr, 
     normal_txtr, 
     map_txtr
    } =  skinTextures(name, renderer, skin,room, )
    
    let mtl = new MeshStandardMaterial();
    
    if(!singleTonMtl.hasOwnProperty(name)){
         mtl.aoMap = ao_txtr
         mtl.lightMap = light_txtr
         mtl.roughnessMap = roughness_txtr
         mtl.normalMap = normal_txtr
         mtl.map =  map_txtr
         mtl.aoMapIntensity = -2
         mtl.name = `mtl_${name}`
        // to calculate paintCanvas possible position and direction
        switch (name) {
          case "walls":
            mtl.wireframe = wallsGlueSetMode
            
            // mtl.emissive.b = 0.494
            // mtl.emissive.g = 0.521
            // mtl.emissive.r = 0.568
            break;
            case "roof":
            console.log("mtl", mtl);
            // mtl.emissive.b = 0.5
            // mtl.emissive.g = 0.6
            // mtl.emissive.r = 0.5
            break;
          case "floor":
            // mtl.emissive.b = 0.45
            // mtl.emissive.g = 0.45
            // mtl.emissive.r = 0.45
            break;
        
          default:
            mtl.wireframe = false
            break;
        }
        
        
      singleTonMtl[name] = mtl;
 
      // console.log("singleTonMtl", singleTonMtl);
      mtl.userData = {
        name: name,
      };
    }
     else{
      mtl = singleTonMtl[name];
    }
    
  return {mtl}
}
    